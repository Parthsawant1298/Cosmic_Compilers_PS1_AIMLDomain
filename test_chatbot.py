import sys
import os
sys.path.append(os.path.dirname(__file__))

from chatbot import get_crime_response, get_crime_context

# Test 1: General query without location
print("="*60)
print("TEST 1: How many total crimes are there?")
print("="*60)
response = get_crime_response("how many total crimes are there?", "")
print(response)
print()

# Test 2: Query for all crime statistics
print("="*60)
print("TEST 2: Total crime statistics")
print("="*60)
response = get_crime_response("total crime statistics", "")
print(response)
print()

# Test 3: Query about Mumbai
print("="*60)
print("TEST 3: Crimes in Mumbai")
print("="*60)
response = get_crime_response("crimes in mumbai", "")
print(response)
print()

# Test 4: Query about Thane (should say no data)
print("="*60)
print("TEST 4: Crimes in Thane")
print("="*60)
response = get_crime_response("crimes in thane", "")
print(response)
print()

# Test 5: Direct context check
print("="*60)
print("TEST 5: Direct context (no filter)")
print("="*60)
context, count = get_crime_context(None)
print(f"Total Count: {count}")
print(context[:500])
