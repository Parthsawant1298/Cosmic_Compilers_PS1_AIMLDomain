"""
Test script to verify hotspot analysis is working
"""

from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Connection
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb+srv://itendswithus0809_db_user:TeXgQ2P4nukIcWhT@cluster0.ibuhedu.mongodb.net/?appName=Cluster0')

print("🔍 Testing Hotspot Analysis...")
print(f"📡 Connecting to MongoDB...")

try:
    client = MongoClient(MONGO_URI)
    
    # Test FIR database
    db = client['fir_system']
    firs_collection = db['firs']
    
    fir_count = firs_collection.count_documents({})
    print(f"✅ Connected to fir_system database")
    print(f"📊 Found {fir_count} FIR records")
    
    if fir_count == 0:
        print("⚠️ WARNING: No FIR records found! Hotspot analysis needs FIR data.")
    else:
        # Get sample FIR
        sample_fir = firs_collection.find_one({})
        print(f"\n📄 Sample FIR fields:")
        for key in sample_fir.keys():
            print(f"   - {key}")
    
    # Test predictions database
    predictions_db = client['fir_data']
    predictions_collection = predictions_db['pattern_predictions']
    
    pred_count = predictions_collection.count_documents({})
    print(f"\n✅ Connected to fir_data database")
    print(f"🧠 Found {pred_count} predictions")
    
    if pred_count > 0:
        print(f"\n🔍 Sample Prediction:")
        sample_pred = predictions_collection.find_one({})
        for key, value in sample_pred.items():
            if key != '_id':
                print(f"   {key}: {value}")
    else:
        print("⚠️ No predictions found. Run pattern analysis first!")
    
    print("\n" + "="*50)
    print("SUMMARY:")
    print(f"FIR Records: {fir_count}")
    print(f"Predictions: {pred_count}")
    
    if fir_count > 0:
        print("✅ Hotspot analysis should work!")
    else:
        print("❌ Need FIR data for hotspot analysis!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
