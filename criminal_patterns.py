"""
Criminal Behavior Pattern Analysis System
Analyzes FIR database and generates top 10 criminal behavior patterns for officers
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import pymongo
import json
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', '*'])

# Configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
MONGODB_URI = os.getenv('MONGODB_URI')

# MongoDB Connection
try:
    client = pymongo.MongoClient(MONGODB_URI)
    db = client.get_database('fir_data')
    firs_collection = db['firs']
    predictions_collection = db['pattern_predictions']  # New collection for predictions
    print("✅ Connected to MongoDB for pattern analysis")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    firs_collection = None
    predictions_collection = None

def get_district_coordinates():
    """Get average coordinates for each district AND police station from FIRs"""
    try:
        # District-level coordinates - FIRs have latitude/longitude fields directly
        district_pipeline = [
            {"$match": {"latitude": {"$exists": True, "$ne": None}, "longitude": {"$exists": True, "$ne": None}}},
            {"$group": {
                "_id": "$district",
                "avg_lat": {"$avg": "$latitude"},
                "avg_lon": {"$avg": "$longitude"},
                "crime_count": {"$sum": 1}
            }}
        ]
        district_coords = {doc['_id']: {'lat': doc['avg_lat'], 'lon': doc['avg_lon'], 'count': doc['crime_count']} 
                          for doc in firs_collection.aggregate(district_pipeline) if doc['_id']}
        
        # Police station-level coordinates (more granular)
        station_pipeline = [
            {"$match": {"latitude": {"$exists": True, "$ne": None}, "longitude": {"$exists": True, "$ne": None}}},
            {"$group": {
                "_id": "$police_station",
                "district": {"$first": "$district"},
                "avg_lat": {"$avg": "$latitude"},
                "avg_lon": {"$avg": "$longitude"},
                "crime_count": {"$sum": 1}
            }}
        ]
        station_coords = {doc['_id']: {
            'lat': doc['avg_lat'], 
            'lon': doc['avg_lon'], 
            'count': doc['crime_count'],
            'district': doc.get('district', 'Mumbai City')
        } for doc in firs_collection.aggregate(station_pipeline) if doc['_id']}
        
        print(f"✅ Loaded coordinates for {len(district_coords)} districts and {len(station_coords)} police stations")
        return {'districts': district_coords, 'stations': station_coords}
    except Exception as e:
        print(f"❌ Error getting coordinates: {e}")
        import traceback
        traceback.print_exc()
        return {'districts': {}, 'stations': {}}

def analyze_database_for_patterns():
    """Analyze the entire FIR database and extract meaningful statistics"""
    try:
        if firs_collection is None:
            return {"error": "Database not connected"}, 0, {}
        
        # Get total FIRs
        total_firs = firs_collection.count_documents({})
        
        # Crime type analysis
        crime_pipeline = [
            {"$group": {"_id": "$crime_type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        crime_stats = list(firs_collection.aggregate(crime_pipeline))
        
        # District-wise analysis
        district_pipeline = [
            {"$group": {"_id": "$district", "cases": {"$sum": 1}}},
            {"$sort": {"cases": -1}}
        ]
        district_stats = list(firs_collection.aggregate(district_pipeline))
        
        # Police station analysis
        ps_pipeline = [
            {"$group": {"_id": "$police_station", "cases": {"$sum": 1}}},
            {"$sort": {"cases": -1}},
            {"$limit": 10}
        ]
        ps_stats = list(firs_collection.aggregate(ps_pipeline))
        
        # Build comprehensive analysis text
        analysis = f"""
📊 COMPREHENSIVE FIR DATABASE ANALYSIS:

TOTAL RECORDS: {total_firs} FIRs

CRIME TYPE DISTRIBUTION:
"""
        for crime in crime_stats[:10]:
            percentage = (crime['count'] / total_firs * 100)
            analysis += f"- {crime['_id']}: {crime['count']} cases ({percentage:.1f}%)\n"
        
        analysis += f"\nDISTRICT ANALYSIS:\n"
        for district in district_stats[:5]:
            percentage = (district['cases'] / total_firs * 100)
            analysis += f"- {district['_id']}: {district['cases']} cases ({percentage:.1f}%)\n"
        
        analysis += f"\nTOP POLICE STATIONS:\n"
        for ps in ps_stats:
            analysis += f"- {ps['_id']}: {ps['cases']} cases\n"
        
        # Get coordinates
        coords = get_district_coordinates()
        
        return analysis, total_firs, coords
        
    except Exception as e:
        print(f"Database analysis error: {str(e)}")
        return f"Error analyzing database: {str(e)}", 0

@app.route('/api/predict-patterns', methods=['POST'])
def predict_criminal_patterns():
    """Generate top 10 criminal behavior patterns using AI"""
    try:
        # Get comprehensive database analysis
        db_analysis, total_count, district_coords = analyze_database_for_patterns()
        
        if isinstance(db_analysis, dict) and 'error' in db_analysis:
            return jsonify({"error": db_analysis['error']}), 500
        
        # Create specialized AI prompt for pattern prediction
        prompt = f"""You are an expert criminologist and law enforcement analyst. Based on the following REAL FIR database statistics, predict the TOP 10 criminal behavior patterns for police officers.

{db_analysis}

INSTRUCTIONS:
Analyze this data and identify 10 distinct criminal behavior patterns. Each pattern should include:

1. Pattern Name - Clear, professional title
2. Risk Level - High, Medium, or Low
3. Description - Detailed 3-4 sentence analysis of the pattern based on the data
4. Affected Areas - Specific locations/districts from the data above
5. Recommended Action - Concrete, actionable advice for law enforcement

IMPORTANT: Base your patterns on the ACTUAL data provided. Use real numbers and locations from the statistics.

Return ONLY a valid JSON array of 10 objects with this exact structure:
[
  {{
    "pattern_name": "Pattern title",
    "risk_level": "High|Medium|Low",
    "description": "Detailed description based on actual data statistics",
    "affected_areas": "Specific locations from data",
    "recommended_action": "Actionable law enforcement recommendation"
  }}
]

Focus on patterns like:
- Crime hotspots based on actual high-crime areas
- Time-based patterns if detectable
- Crime type clustering in specific areas
- High-frequency crime types requiring attention
- Geographic concentration patterns
- Emerging trends from the data

Return ONLY the JSON array, no other text."""

        # Call OpenRouter AI
        ai_client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1"
        )
        
        response = ai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert criminologist specializing in pattern analysis. Always return valid JSON arrays only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4,
            max_tokens=2000
        )
        
        ai_response = response.choices[0].message.content
        
        # Extract and parse JSON
        try:
            # Try to extract JSON array from response
            json_start = ai_response.find('[')
            json_end = ai_response.rfind(']') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = ai_response[json_start:json_end]
                patterns = json.loads(json_str)
                
                # Validate we have 10 patterns
                if len(patterns) < 10:
                    print(f"⚠️ AI returned only {len(patterns)} patterns, expected 10")
                
                # Add REAL coordinates to patterns based on affected areas
                districts = district_coords.get('districts', {})
                stations = district_coords.get('stations', {})
                
                for i, pattern in enumerate(patterns[:10]):
                    affected = pattern.get('affected_areas', '').strip()
                    coords_found = False
                    
                    # First try to match police stations (most granular)
                    for station_name, coords in stations.items():
                        if station_name and station_name.lower() in affected.lower():
                            pattern['latitude'] = coords['lat']
                            pattern['longitude'] = coords['lon']
                            pattern['district'] = coords['district']
                            coords_found = True
                            print(f"  ✅ Matched '{affected}' to station '{station_name}' at ({coords['lat']:.4f}, {coords['lon']:.4f})")
                            break
                    
                    # Then try districts
                    if not coords_found:
                        for district_name, coords in districts.items():
                            if district_name and district_name.lower() in affected.lower():
                                pattern['latitude'] = coords['lat']
                                pattern['longitude'] = coords['lon']
                                pattern['district'] = district_name
                                coords_found = True
                                print(f"  ✅ Matched '{affected}' to district '{district_name}' at ({coords['lat']:.4f}, {coords['lon']:.4f})")
                                break
                    
                    # Last resort: search for partial matches
                    if not coords_found:
                        # Try partial matches for stations
                        for station_name, coords in stations.items():
                            if station_name and (affected.lower() in station_name.lower() or station_name.lower() in affected.lower()):
                                pattern['latitude'] = coords['lat']
                                pattern['longitude'] = coords['lon']
                                pattern['district'] = coords['district']
                                coords_found = True
                                print(f"  ⚠️ Partial match '{affected}' ≈ '{station_name}' at ({coords['lat']:.4f}, {coords['lon']:.4f})")
                                break
                    
                    # If still not found, use default (should be rare)
                    if not coords_found:
                        pattern['latitude'] = 19.0760 + (i * 0.02)
                        pattern['longitude'] = 72.8777 + (i * 0.02)
                        pattern['district'] = 'Mumbai City'
                        print(f"  ⚠️ No coordinates found for '{affected}', using default")
                    
                    pattern['id'] = i + 1
                    pattern['timestamp'] = datetime.now().isoformat()
                
                # Store in database - REPLACE existing predictions
                if predictions_collection is not None:
                    try:
                        # Delete all existing predictions
                        predictions_collection.delete_many({})
                        # Insert new top 10
                        predictions_collection.insert_many(patterns[:10])
                        print(f"✅ Stored {len(patterns[:10])} predictions in database")
                    except Exception as e:
                        print(f"⚠️ Failed to store predictions: {e}")
                
                # Remove MongoDB _id fields for JSON serialization
                clean_patterns = []
                for p in patterns[:10]:
                    clean_p = {k: v for k, v in p.items() if k != '_id'}
                    clean_patterns.append(clean_p)
                
                return jsonify({
                    "success": True,
                    "patterns": clean_patterns,  # Ensure max 10
                    "total_firs": total_count,
                    "analysis_timestamp": "now"
                })
            else:
                raise ValueError("No JSON array found in AI response")
                
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            print(f"AI Response: {ai_response[:500]}")
            return jsonify({
                "error": "Failed to parse AI response as JSON",
                "raw_response": ai_response[:1000]
            }), 500
            
    except Exception as e:
        print(f"❌ Error generating patterns: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        "status": "healthy",
        "service": "Criminal Pattern Analysis",
        "mongodb_connected": firs_collection is not None,
        "openrouter_configured": OPENROUTER_API_KEY is not None
    })

if __name__ == '__main__':
    print("\n🧠 Criminal Pattern Analysis System Starting...")
    print("📊 Analyzing FIR database for behavioral patterns")
    print("🚀 Server running on http://0.0.0.0:5003")
    app.run(host='0.0.0.0', port=5003, debug=True)
