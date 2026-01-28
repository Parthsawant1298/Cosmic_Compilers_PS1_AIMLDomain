"""
Crime Hotspot Analysis Service
Analyzes FIR database to identify crime hotspots and high-risk zones
"""

from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from collections import defaultdict, Counter
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb+srv://itendswithus0809_db_user:TeXgQ2P4nukIcWhT@cluster0.ibuhedu.mongodb.net/?appName=Cluster0')
client = MongoClient(MONGO_URI)

# Use fir_data database (same as pattern analysis)
db = client['fir_data']
firs_collection = db['firs']
predictions_collection = db['pattern_predictions']

def calculate_hotspots():
    """
    Analyze all FIRs in database to identify crime hotspots
    Returns hotspots with crime density, types, and coordinates
    """
    try:
        # Fetch all FIRs from database
        all_firs = list(firs_collection.find({}))
        print(f"📊 Analyzing {len(all_firs)} FIR records for hotspots...")
        
        # Group by location (district/police station)
        location_crimes = defaultdict(lambda: {
            'count': 0,
            'crime_types': Counter(),
            'districts': set(),
            'coordinates': [],
            'recent_crimes': 0,  # last 30 days
            'severity_score': 0
        })
        
        # Crime severity weights
        severity_weights = {
            'Murder': 10,
            'Rape': 9,
            'Robbery': 8,
            'Kidnapping': 8,
            'Assault': 7,
            'Burglary': 6,
            'Chain Snatching': 5,
            'Theft': 4,
            'Cybercrime': 4,
            'Fraud': 3,
            'Other': 2
        }
        
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        for fir in all_firs:
            # Extract location information
            location = fir.get('police_station', 'Unknown')
            district = fir.get('district', 'Unknown')
            crime_type = fir.get('crime_type', 'Other')
            
            # Get coordinates from geometry
            geometry = fir.get('geometry', {})
            if geometry and 'coordinates' in geometry:
                coords = geometry['coordinates']
                if coords and len(coords) == 2:
                    lat, lon = coords[1], coords[0]  # GeoJSON is [lon, lat]
                else:
                    lat, lon = None, None
            else:
                lat, lon = None, None
            
            # Create location key
            location_key = f"{location}|{district}"
            
            # Update location data
            location_crimes[location_key]['count'] += 1
            location_crimes[location_key]['crime_types'][crime_type] += 1
            location_crimes[location_key]['districts'].add(district)
            
            if lat and lon:
                location_crimes[location_key]['coordinates'].append([lat, lon])
            
            # Check if recent crime (last 30 days)
            try:
                incident_date = fir.get('incident_date')
                if incident_date:
                    if isinstance(incident_date, str):
                        crime_date = datetime.fromisoformat(incident_date.replace('Z', '+00:00'))
                    else:
                        crime_date = incident_date
                    
                    if crime_date >= thirty_days_ago:
                        location_crimes[location_key]['recent_crimes'] += 1
            except:
                pass
            
            # Add severity score
            weight = severity_weights.get(crime_type, 2)
            location_crimes[location_key]['severity_score'] += weight
        
        # Convert to hotspot list
        hotspots = []
        for location_key, data in location_crimes.items():
            location, district = location_key.split('|')
            
            # Calculate average coordinates
            if data['coordinates']:
                avg_lat = sum(c[0] for c in data['coordinates']) / len(data['coordinates'])
                avg_lon = sum(c[1] for c in data['coordinates']) / len(data['coordinates'])
            else:
                # Default Mumbai coordinates if no coords available
                avg_lat, avg_lon = 19.0760, 72.8777
            
            # Get top crime types
            top_crimes = data['crime_types'].most_common(3)
            
            # Calculate risk level
            crime_count = data['count']
            recent_count = data['recent_crimes']
            severity = data['severity_score']
            
            # Risk score calculation
            risk_score = (crime_count * 1.0) + (recent_count * 2.0) + (severity * 0.5)
            
            # Determine risk level
            if risk_score > 100:
                risk_level = 'Critical'
                color = '#dc2626'  # red-600
            elif risk_score > 50:
                risk_level = 'High'
                color = '#f97316'  # orange-500
            elif risk_score > 20:
                risk_level = 'Medium'
                color = '#eab308'  # yellow-500
            else:
                risk_level = 'Low'
                color = '#22c55e'  # green-500
            
            hotspot = {
                'id': len(hotspots) + 1,
                'location': location,
                'district': district,
                'latitude': avg_lat,
                'longitude': avg_lon,
                'total_crimes': crime_count,
                'recent_crimes': recent_count,
                'severity_score': severity,
                'risk_score': risk_score,
                'risk_level': risk_level,
                'color': color,
                'top_crimes': [{'type': crime, 'count': count} for crime, count in top_crimes],
                'crime_types': dict(data['crime_types'])
            }
            hotspots.append(hotspot)
        
        # Sort by risk score (highest first)
        hotspots.sort(key=lambda x: x['risk_score'], reverse=True)
        
        # Add rank
        for i, hotspot in enumerate(hotspots):
            hotspot['rank'] = i + 1
        
        print(f"✅ Identified {len(hotspots)} crime hotspots")
        return hotspots
        
    except Exception as e:
        print(f"❌ Error calculating hotspots: {e}")
        import traceback
        traceback.print_exc()
        return []

@app.route('/api/hotspots', methods=['GET'])
def get_hotspots():
    """
    API endpoint to get crime hotspots
    """
    try:
        hotspots = calculate_hotspots()
        
        # Calculate district-wise summary
        district_summary = defaultdict(lambda: {
            'total_crimes': 0,
            'hotspot_count': 0,
            'risk_levels': Counter(),
            'avg_risk_score': 0
        })
        
        for hotspot in hotspots:
            district = hotspot['district']
            district_summary[district]['total_crimes'] += hotspot['total_crimes']
            district_summary[district]['hotspot_count'] += 1
            district_summary[district]['risk_levels'][hotspot['risk_level']] += 1
            district_summary[district]['avg_risk_score'] += hotspot['risk_score']
        
        # Calculate averages
        for district, data in district_summary.items():
            if data['hotspot_count'] > 0:
                data['avg_risk_score'] = round(data['avg_risk_score'] / data['hotspot_count'], 2)
            data['risk_levels'] = dict(data['risk_levels'])
        
        return jsonify({
            'success': True,
            'hotspots': hotspots,
            'total_hotspots': len(hotspots),
            'district_summary': dict(district_summary),
            'critical_zones': [h for h in hotspots if h['risk_level'] == 'Critical'],
            'high_risk_zones': [h for h in hotspots if h['risk_level'] == 'High'],
        })
        
    except Exception as e:
        print(f"❌ Error in hotspots API: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/hotspots/district/<district_name>', methods=['GET'])
def get_district_hotspots(district_name):
    """
    Get hotspots for specific district
    """
    try:
        all_hotspots = calculate_hotspots()
        district_hotspots = [h for h in all_hotspots if h['district'].lower() == district_name.lower()]
        
        return jsonify({
            'success': True,
            'district': district_name,
            'hotspots': district_hotspots,
            'count': len(district_hotspots)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/hotspots/city', methods=['GET'])
def get_city_summary():
    """
    Get city-wide hotspot summary
    """
    try:
        hotspots = calculate_hotspots()
        
        city_stats = {
            'total_hotspots': len(hotspots),
            'total_crimes': sum(h['total_crimes'] for h in hotspots),
            'critical_zones': len([h for h in hotspots if h['risk_level'] == 'Critical']),
            'high_risk_zones': len([h for h in hotspots if h['risk_level'] == 'High']),
            'medium_risk_zones': len([h for h in hotspots if h['risk_level'] == 'Medium']),
            'low_risk_zones': len([h for h in hotspots if h['risk_level'] == 'Low']),
            'top_10_hotspots': hotspots[:10]
        }
        
        return jsonify({
            'success': True,
            'city_stats': city_stats
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """
    Get AI-generated pattern predictions from database
    Returns the stored top 10 predictions for map visualization
    """
    try:
        # Fetch all predictions from collection
        predictions = list(predictions_collection.find({}, {'_id': 0}))
        
        # Format predictions for map display
        formatted_predictions = []
        for pred in predictions:
            formatted_predictions.append({
                'id': pred.get('id', 0),
                'pattern_name': pred.get('pattern_name', 'Unknown Pattern'),
                'risk_level': pred.get('risk_level', 'Medium'),
                'description': pred.get('description', ''),
                'affected_areas': pred.get('affected_areas', ''),
                'recommended_action': pred.get('recommended_action', ''),
                'latitude': pred.get('latitude', 19.0760),
                'longitude': pred.get('longitude', 72.8777),
                'district': pred.get('district', 'Mumbai City'),
                'timestamp': pred.get('timestamp', ''),
                'type': 'prediction'  # Mark as prediction vs hotspot
            })
        
        return jsonify({
            'success': True,
            'predictions': formatted_predictions,
            'count': len(formatted_predictions)
        })
        
    except Exception as e:
        print(f"❌ Error fetching predictions: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e),
            'predictions': []
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Crime Hotspot Analysis Service on port 5008...")
    print("📊 Analyzing FIR database for crime hotspots...")
    app.run(debug=True, port=5008)
