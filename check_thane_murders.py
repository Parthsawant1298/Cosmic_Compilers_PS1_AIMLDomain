from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to database
uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client.get_database('fir_data')
col = db['firs']

# Check for Thane district
print("🔍 Checking for Thane data...\n")

# Query 1: All FIRs in Thane
thane_firs = col.count_documents({"district": {"$regex": "Thane", "$options": "i"}})
print(f"Total FIRs in Thane district: {thane_firs}")

# Query 2: Murder cases in Thane
thane_murders = col.count_documents({
    "district": {"$regex": "Thane", "$options": "i"},
    "crime_type": {"$regex": "Murder", "$options": "i"}
})
print(f"Murder cases in Thane: {thane_murders}")

# Query 3: All murder cases in database
all_murders = col.count_documents({"crime_type": {"$regex": "Murder", "$options": "i"}})
print(f"Total Murder cases in entire database: {all_murders}")

# Query 4: Crime breakdown in Thane
if thane_firs > 0:
    print("\n📊 Crime breakdown in Thane:")
    thane_crimes = list(col.aggregate([
        {"$match": {"district": {"$regex": "Thane", "$options": "i"}}},
        {"$group": {"_id": "$crime_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]))
    for crime in thane_crimes:
        print(f"  - {crime['_id']}: {crime['count']} cases")
else:
    print("\n❌ No FIR records found for Thane district")

# Query 5: All districts with Murder cases
print("\n🗺️ Districts with Murder cases:")
murder_districts = list(col.aggregate([
    {"$match": {"crime_type": {"$regex": "Murder", "$options": "i"}}},
    {"$group": {"_id": "$district", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
]))
for d in murder_districts:
    print(f"  - {d['_id']}: {d['count']} murder(s)")

print("\n" + "="*50)
print(f"ANSWER: Does Thane have 18 murders? {'YES ✅' if thane_murders == 18 else f'NO ❌ (Actual: {thane_murders})'}")
