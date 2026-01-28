"""
🚀 FastAPI - Fetches YOUR exact MongoDB FIR structure
"""

import os
import pymongo
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import urllib.parse

app = FastAPI(title="🚨 Mumbai FIR API - Your Atlas Data")

# YOUR ATLAS URI (URL encoded)
MONGODB_URI = "mongodb+srv://itendswithus0809_db_user:TeXgQ2P4nukIcWhT@cluster0.ibuhedu.mongodb.net/?appName=Cluster0"
MONGODB_URI = MONGODB_URI.replace("TeXgQ2P4nukIcWhT", urllib.parse.quote_plus("TeXgQ2P4nukIcWhT"))

client = pymongo.MongoClient(MONGODB_URI)
db = client["fir_data"]
firs_collection = db["firs"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    client.admin.command('ping')
    count = firs_collection.count_documents({})
    print(f"✅ Connected! Found {count} FIRs in your collection")

@app.get("/firs")
async def get_all_firs(limit: int = 500):
    """Get ALL your FIRs exactly as stored"""
    firs = list(firs_collection.find().sort("processed_at", -1).limit(limit))
    return {"firs": firs, "count": len(firs)}

@app.get("/firs/heatmap")
async def get_heatmap_data():
    """Convert YOUR MongoDB FIRs → Mapbox GeoJSON"""
    all_firs = list(firs_collection.find({
        "latitude": {"$ne": None}, 
        "longitude": {"$ne": None}
    }))
    
    print(f"📍 Converting {len(all_firs)} FIRs to GeoJSON...")
    
    features = []
    for fir in all_firs:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [fir["longitude"], fir["latitude"]]  # [lng, lat]
            },
            "properties": {
                "fir_number": fir["fir_number"],
                "police_station": fir["police_station"],
                "district": fir["district"],
                "incident_date": fir["incident_date"],
                "incident_time": fir["incident_time"],
                "crime_type": fir["crime_type"],
                "sections": fir["sections"],
                "description": fir["description"],
                "status": fir["status"]
            }
        })
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

@app.get("/stats")
async def get_stats():
    """Crime stats from YOUR data"""
    pipeline = [
        {"$group": {"_id": "$crime_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    return list(firs_collection.aggregate(pipeline))

@app.get("/firs/raw")
async def get_raw_firs(limit: int = 20):
    """Raw FIRs for debugging"""
    return {"sample": list(firs_collection.find().limit(limit))}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
