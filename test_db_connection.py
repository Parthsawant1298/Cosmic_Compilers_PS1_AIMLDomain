from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Get MongoDB URI
uri = os.getenv('MONGODB_URI')
print(f"Connecting to MongoDB...")

# Connect to database
client = MongoClient(uri)
db = client.get_database('fir_data')
col = db['firs']

# Test 1: Count total FIRs
count = col.count_documents({})
print(f'\n✅ MongoDB Connected Successfully!')
print(f'📊 Total FIRs in database: {count}')

# Test 2: Get crime type distribution
crime_types = list(col.aggregate([
    {'$group': {'_id': '$crime_type', 'count': {'$sum': 1}}},
    {'$sort': {'count': -1}},
    {'$limit': 5}
]))
print('\n🔍 Top 5 Crime Types:')
for ct in crime_types:
    print(f"  - {ct['_id']}: {ct['count']} cases")

# Test 3: Get district distribution
districts = list(col.aggregate([
    {'$group': {'_id': '$district', 'count': {'$sum': 1}}},
    {'$sort': {'count': -1}},
    {'$limit': 5}
]))
print('\n📍 Top 5 Districts:')
for d in districts:
    print(f"  - {d['_id']}: {d['count']} cases")

# Test 4: Sample FIR data
sample = col.find_one()
print('\n📄 Sample FIR Record:')
print(f"  Crime Type: {sample.get('crime_type', 'N/A')}")
print(f"  Police Station: {sample.get('police_station', 'N/A')}")
print(f"  District: {sample.get('district', 'N/A')}")
print(f"  Location: ({sample.get('latitude', 'N/A')}, {sample.get('longitude', 'N/A')})")

print('\n✅ Database connection test PASSED - Chatbot is connected to REAL data!')
