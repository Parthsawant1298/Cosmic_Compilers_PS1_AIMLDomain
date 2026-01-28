from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import pymongo
import urllib.parse

load_dotenv()
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', '*'])

# OpenRouter API Configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

if not OPENROUTER_API_KEY:
    print("❌ WARNING: OPENROUTER_API_KEY not found in .env")
else:
    print("✅ OpenRouter API key loaded successfully")

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/safecity')
try:
    client = pymongo.MongoClient(MONGODB_URI)
    db = client.get_database('fir_data')
    firs_collection = db['firs']
    print("✅ Connected to MongoDB for crime data context")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    firs_collection = None

def get_crime_context(specific_location=None):
    """Get detailed crime statistics, optionally filtered by location"""
    try:
        if firs_collection is None:
            return "Crime database unavailable."
        
        # Build query filter
        query_filter = {}
        if specific_location:
            # Search in police_station, district, or state fields
            query_filter = {"$or": [
                {"police_station": {"$regex": specific_location, "$options": "i"}},
                {"district": {"$regex": specific_location, "$options": "i"}},
                {"state": {"$regex": specific_location, "$options": "i"}}
            ]}
        
        # Get total FIRs
        total_firs = firs_collection.count_documents(query_filter)
        
        # Get crime type distribution
        crime_pipeline = [{"$match": query_filter}] if query_filter else []
        crime_pipeline.extend([
            {"$group": {"_id": "$crime_type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ])
        crime_stats = list(firs_collection.aggregate(crime_pipeline))
        
        # Get district-wise breakdown
        district_pipeline = [{"$match": query_filter}] if query_filter else []
        district_pipeline.extend([
            {"$group": {"_id": "$district", "cases": {"$sum": 1}}},
            {"$sort": {"cases": -1}},
            {"$limit": 5}
        ])
        districts = list(firs_collection.aggregate(district_pipeline))
        
        # Get police station breakdown
        ps_pipeline = [{"$match": query_filter}] if query_filter else []
        ps_pipeline.extend([
            {"$group": {"_id": "$police_station", "cases": {"$sum": 1}}},
            {"$sort": {"cases": -1}},
            {"$limit": 5}
        ])
        police_stations = list(firs_collection.aggregate(ps_pipeline))
        
        location_text = f" in {specific_location}" if specific_location else ""
        
        context = f"""
REAL CRIME DATABASE STATISTICS{location_text.upper()}:
- Total FIRs recorded: {total_firs}
- Crime Types: {', '.join([f"{stat['_id']} ({stat['count']} cases)" for stat in crime_stats[:5]])}
- Top Districts: {', '.join([f"{d['_id']} ({d['cases']} cases)" for d in districts[:3]])}
- Active Police Stations: {', '.join([f"{ps['_id']} ({ps['cases']} cases)" for ps in police_stations[:3]])}
"""
        return context, total_firs
    except Exception as e:
        print(f"Database query error: {str(e)}")
        return f"Crime database query error: {str(e)}", 0

def get_crime_response(user_question, conversation_history=""):
    """Get AI response for crime-related questions"""
    try:
        # Extract location if mentioned in query (use word boundaries)
        import re
        specific_location = None
        user_lower = user_question.lower()
        
        # Common location patterns
        location_patterns = [
            r'\bin\s+([A-Za-z\s]{2,20})(?:\?|$|,|\.|district|city)',
            r'\bat\s+([A-Za-z\s]{2,20})(?:\?|$|,|\.|district|city)',
            r'\bnear\s+([A-Za-z\s]{2,20})(?:\?|$|,|\.|district|city)',
            r'\baround\s+([A-Za-z\s]{2,20})(?:\?|$|,|\.|district|city)',
            r'\bfrom\s+([A-Za-z\s]{2,20})(?:\?|$|,|\.|district|city)',
        ]
        
        # Ignore generic words
        ignore_words = {'crimes', 'crime', 'firs', 'fir', 'cases', 'database', 'records', 
                        'statistics', 'stats', 'total', 'data', 'information', 'the', 'a', 
                        'an', 'this', 'that', 'these', 'those', 'there'}
        
        for pattern in location_patterns:
            match = re.search(pattern, user_lower)
            if match:
                location_text = match.group(1).strip()
                # Clean and validate
                location_words = [w for w in location_text.split() if w not in ignore_words]
                if location_words:
                    specific_location = ' '.join(location_words[:2])  # Max 2 words
                    break
        
        # Get live crime context
        crime_context, total_count = get_crime_context(specific_location)
        
        prompt = f"""
You are SafeCity AI, a helpful assistant with access to REAL crime database.

📊 LIVE DATABASE STATISTICS:

{crime_context}

✅ WHAT YOU CAN DO:
- Use your intelligence to understand user questions naturally
- Answer questions using the EXACT numbers from statistics above
- Interpret variations like "total crimes", "crime statistics", "how many FIRs" - all mean the Total FIRs number
- If Total FIRs = {total_count} and user asks about total crimes, USE that number
- Provide helpful analysis of the crime types, districts shown above
- Be conversational and helpful while citing real data

❌ WHAT YOU CANNOT DO:
- Make up numbers not in the statistics
- Provide data for locations NOT listed in the districts/police stations above
- Invent crime types not shown in the statistics
- Estimate or guess when specific data is missing

🎯 HOW TO RESPOND:
- If {total_count} > 0: You HAVE data! Answer the question using the statistics
- If asked about "total crimes" or "crime statistics": Use the Total FIRs number ({total_count})
- If asked about specific location NOT in districts list: Say that location is not in database, show what IS available
- If asked about crime type NOT in the list: Say we don't have that crime type, show what IS available
- Always start with "According to our database..." or "Our FIR records show..."

Previous conversation:
{conversation_history}

User question: {user_question}

Answer naturally and helpfully using the EXACT statistics above. Be smart about interpreting the question!

Answer:
"""
        
        client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1"
        )
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are SafeCity AI, a helpful crime data assistant. Use your intelligence to understand questions and answer using ONLY the real database statistics provided. Be conversational but use exact numbers from the data."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.5,
            max_tokens=800
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"I apologize, but I encountered an error: {str(e)}. Please try again or contact support."

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint for text conversations"""
    try:
        data = request.json
        user_question = data.get('message', '')
        conversation_history = data.get('history', '')
        
        if not user_question:
            return jsonify({"error": "No message provided"}), 400
        
        response = get_crime_response(user_question, conversation_history)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/crime-stats', methods=['GET'])
def crime_stats():
    """Get current crime statistics"""
    try:
        context = get_crime_context()
        return jsonify({"stats": context})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "SafeCity Chatbot",
        "mongodb_connected": firs_collection is not None,
        "openrouter_configured": OPENROUTER_API_KEY is not None
    })

if __name__ == '__main__':
    print("\n🤖 SafeCity Chatbot Server Starting...")
    print("📊 Connected to crime database")
    print("🚀 Server running on http://0.0.0.0:5002")
    app.run(host='0.0.0.0', port=5002, debug=True)
