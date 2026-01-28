from chatbot import get_crime_response

# Debug location extraction
test_queries = [
    "how many total crimes are there?",
    "total crime statistics",
    "show me crime stats",
    "what are the statistics?"
]

for query in test_queries:
    print(f"\nQuery: {query}")
    
    # Manually extract location using same logic
    location_keywords = ['in', 'at', 'near', 'around', 'from']
    specific_location = None
    user_lower = query.lower()
    
    ignore_words = ['crimes', 'crime', 'firs', 'fir', 'cases', 'database', 'records', 
                    'statistics', 'stats', 'total', 'data', 'information']
    
    for keyword in location_keywords:
        if keyword in user_lower:
            parts = user_lower.split(keyword)
            if len(parts) > 1:
                potential_loc = parts[1].strip().split()[0:2]
                location_text = ' '.join(potential_loc).strip('?.,!')
                
                if location_text and location_text not in ignore_words:
                    specific_location = location_text
                    break
    
    print(f"  -> Extracted location: {specific_location}")
    print(f"  -> Query will use filter: {specific_location is not None}")
