"""
Test if predictions API endpoint works
"""
import requests

print("🧪 Testing Predictions API Endpoint...")

try:
    response = requests.get('http://localhost:5008/api/predictions')
    data = response.json()
    
    print(f"✅ Status Code: {response.status_code}")
    print(f"✅ Success: {data.get('success')}")
    print(f"📊 Predictions Count: {data.get('count')}")
    
    if data.get('predictions'):
        print(f"\n🔍 First Prediction:")
        pred = data['predictions'][0]
        print(f"   Pattern: {pred.get('pattern_name')}")
        print(f"   Risk: {pred.get('risk_level')}")
        print(f"   Location: ({pred.get('latitude')}, {pred.get('longitude')})")
        print(f"   District: {pred.get('district')}")
        
        print(f"\n✅ All {len(data['predictions'])} predictions ready for map!")
    else:
        print("❌ No predictions returned")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("⚠️ Make sure hotspot_analysis.py is running on port 5008!")
