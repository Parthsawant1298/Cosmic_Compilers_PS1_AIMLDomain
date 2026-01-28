"""
🚀 500+ Realistic Mumbai FIRs → YOUR MongoDB Atlas Cluster
"""

import pymongo
import random
from datetime import datetime, timedelta
import os
import urllib.parse

# YOUR ATLAS CONNECTION
MONGODB_URI = "mongodb+srv://itendswithus0809_db_user:TeXgQ2P4nukIcWhT@cluster0.ibuhedu.mongodb.net/?appName=Cluster0"

# URL encode password (Atlas requirement)
MONGODB_URI = MONGODB_URI.replace("TeXgQ2P4nukIcWhT", urllib.parse.quote_plus("TeXgQ2P4nukIcWhT"))

# Mumbai Police Stations + GPS Coordinates
MUMBAI_PS = {
    "Andheri": [19.1183, 72.8355],
    "Bandra": [19.0612, 72.8392],
    "Borivali": [19.2333, 72.8567],
    "Chembur": [19.0511, 72.9087],
    "Dahisar": [19.2524, 72.8446],
    "Ghatkopar": [19.0815, 72.9087],
    "Jogeshwari": [19.1447, 72.8446],
    "Kandivali": [19.2083, 72.8333],
    "Malwani": [19.2333, 72.8000],
    "Mulund": [19.1750, 72.9583],
    "Oshiwara": [19.1333, 72.8250],
    "Powai": [19.1244, 72.9064],
    "Vakola": [19.0850, 72.8250]
}

CRIME_TYPES = {
    "Theft": 0.40,
    "Chain Snatching": 0.15,
    "Burglary": 0.12,
    "Assault": 0.10,
    "Fraud": 0.08,
    "Cybercrime": 0.08,
    "Rape": 0.03,
    "Murder": 0.02,
    "Robbery": 0.02
}

IPC_SECTIONS = ["IPC 379", "IPC 420", "IPC 323", "IPC 406", "IPC 354", "IPC 302", "IPC 392"]

def weighted_random_choice(choices):
    items = list(choices.keys())
    probabilities = list(choices.values())
    return random.choices(items, weights=probabilities, k=1)[0]

print("🔗 Connecting to MongoDB Atlas...")
client = pymongo.MongoClient(MONGODB_URI)
collection = client["fir_data"]["firs"]  # Uses 'fir_data' database

# Test connection
try:
    client.admin.command('ping')
    print("✅ Connected to MongoDB Atlas!")
except Exception as e:
    print(f"❌ Atlas connection failed: {e}")
    print("💡 Check Network Access (0.0.0.0/0) in Atlas dashboard")
    exit(1)

def generate_realistic_fir():
    ps_name, (base_lat, base_lng) = random.choice(list(MUMBAI_PS.items()))
    
    # GPS jitter (±200m accuracy)
    lat = base_lat + random.uniform(-0.002, 0.002)
    lng = base_lng + random.uniform(-0.003, 0.003)
    
    days_back = random.randint(0, 30)
    incident_date = (datetime.now() - timedelta(days=days_back)).strftime("%d/%m/%Y")
    
    fir_num = f"{random.randint(100, 999)}/2026"
    
    return {
        "fir_number": fir_num,
        "police_station": ps_name,
        "district": "Mumbai Suburban",
        "incident_date": incident_date,
        "incident_time": f"{random.randint(6,23):02d}:{random.randint(0,59):02d}",
        "latitude": round(lat, 6),
        "longitude": round(lng, 6),
        "crime_type": weighted_random_choice(CRIME_TYPES),
        "sections": random.sample(IPC_SECTIONS, random.randint(1, 3)),
        "description": f"Incident reported in {ps_name} PS jurisdiction - {random.choice(['Mobile phone theft', 'Gold chain snatching', 'Residential burglary', 'Street assault', 'Online fraud'])}",
        "status": random.choice(["Under Investigation", "Chargesheet Filed", "Accused Arrested"]),
        "processed_at": datetime.now().isoformat(),
        "source": "synthetic_mumbai_2026"
    }

# Generate & Insert 500 FIRs
print("\n🚀 Generating 500 realistic Mumbai FIRs...")
firs = [generate_realistic_fir() for _ in range(500)]

# Clear old data
collection.delete_many({})
print("🗑️ Cleared old data")

# Insert new data
result = collection.insert_many(firs)
print(f"✅ Inserted {len(result.inserted_ids)} FIRs into Atlas!")

# Show stats
crime_stats = list(collection.aggregate([
    {"$group": {"_id": "$crime_type", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
]))

print("\n📊 Crime Distribution (Last 30 Days):")
for stat in crime_stats:
    print(f"  🔴 {stat['_id']}: {stat['count']} cases ({stat['count']/5:.0f}/day)")

print(f"\n🎉 SUCCESS! Your Atlas cluster is ready:")
print(f"   Database: fir_data")
print(f"   Collection: firs")
print(f"   Records: {collection.count_documents({})}")
print("\n🔥 Next: Start API server → Connect Next.js heatmap!")
