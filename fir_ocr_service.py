from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import base64
import json
import requests
from openai import OpenAI
import os
from werkzeug.utils import secure_filename
import pymongo
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # Allow requests from Next.js frontend
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# OpenRouter API key from environment variables
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

# MongoDB connection - MUST match your backend exactly
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://itendswithus0809_db_user:TeXgQ2P4nukIcWhT@cluster0.ibuhedu.mongodb.net/?appName=Cluster0')
client = pymongo.MongoClient(MONGODB_URI)
db = client.fir_data  # Same database as your backend
fir_collection = db.firs  # Same collection as your backend

# System prompt for FIR OCR
SYSTEM_PROMPT = """Convert the provided FIR (First Information Report) image into Markdown format. Ensure that all content from the document is included, such as headers, footers, form fields, tables, and any other elements. Extract text in ALL languages present in the image (including Marathi, Hindi, English, or any other Indian language).

Requirements:
- Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
- No Delimiters: Do not use code fences or delimiters like ```markdown.
- Complete Content: Do not omit any part of the document, including all form fields and official details.
- Language Support: Accurately extract text in any language present in the image."""

def qwen_multilingual_ocr(image_data):
    """Perform OCR using Qwen-2-VL-72B model for FIR documents"""

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please perform OCR on this FIR (First Information Report) document and extract all visible text accurately in any language (Marathi, Hindi, English, etc.). Focus on form fields, case numbers, dates, locations, and crime details. Only provide the extracted text, nothing else."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_data}"
                    }
                }
            ]
        }
    ]

    client = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    response = client.chat.completions.create(
        model="qwen/qwen-2-vl-72b-instruct",
        messages=messages
    )
    return response.choices[0].message.content

def detect_language(text):
    """Detect language of extracted text"""

    language_detection = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    messages = [{
        "role": "system",
        "content": "You are expert in language detection. Analyze the given text and identify the primary language. Return only the language name."
    },
    {
        "role": "user",
        "content": f"What language is this text: {text[:500]}... Just mention the language name, nothing else. Do not give any sentence, just the language name in one word."
    }]

    response = language_detection.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return response.choices[0].message.content.strip()

def translate_to_english(text, language):
    """Translate text to English while preserving structure"""

    if language.lower() == 'english':
        return text

    language_translate_agent = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    messages = [{
        "role": "system",
        "content": "You are a helpful assistant that translates any language into English while preserving the document structure and official terminology."
    },
    {
        "role": "user",
        "content": f"Translate this FIR document text from {language} to English, keeping all official terms, case numbers, and structure intact: {text}"
    }]

    response = language_translate_agent.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return response.choices[0].message.content

def convert_to_fir_json(translated_text):
    """Convert translated FIR text to structured JSON matching database schema"""

    json_agent = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    messages = [{
        "role": "system",
        "content": f"""You are a helpful assistant that converts FIR (First Information Report) documents into JSON format. Extract the following fields from the FIR document and return EXACTLY this structure:

        {{
          "fir_number": "",
          "police_station": "",
          "district": "",
          "incident_date": "",
          "incident_time": "",
          "crime_type": "",
          "sections": [],
          "description": "",
          "status": ""
        }}

        CRITICAL GUIDELINES:
        - crime_type MUST be one of: "Murder", "Rape", "Robbery", "Assault", "Burglary", "Chain Snatching", "Theft", "Cybercrime", "Fraud"
        - sections should be an array of IPC sections like ["IPC 302", "IPC 379"]
        - status MUST be one of: "Under Investigation", "Accused Arrested", "Chargesheet Filed", "Case Closed"
        - Format dates as DD/MM/YYYY
        - description should include a brief summary like "Incident reported in [police_station] PS jurisdiction - [brief description]"
        - Return ONLY valid JSON without markdown formatting or code blocks
        - If information is missing, use reasonable defaults
        """
    },
    {
        "role": "user",
        "content": f"Convert this FIR document text into JSON format: {translated_text}"
    }]

    response = json_agent.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return response.choices[0].message.content

def get_coordinates_from_location(fir_data):
    """Get coordinates using location details from FIR data"""

    # Extract location info
    place_of_occurrence = fir_data.get('place_of_occurrence', '')
    police_station = fir_data.get('police_station', '')
    district = fir_data.get('district', '')

    # Try multiple search queries in order of specificity
    search_queries = [
        f"{place_of_occurrence}, {district}",  # Most specific
        f"{police_station}, {district}",       # Police station level
        f"{police_station}",                   # Police station only
        f"{district}",                         # District level
    ]

    for query in search_queries:
        if not query.strip() or query.strip() == ",":
            continue

        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "fir-coordinates-fetcher/1.0"}

        try:
            print(f"🔍 Trying search: {query}")
            resp = requests.get(url, params=params, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()

            if data:
                lat = float(data[0]["lat"])
                lon = float(data[0]["lon"])
                print(f"✅ Found coordinates: {lat}, {lon}")
                return {"latitude": lat, "longitude": lon}

        except Exception as e:
            print(f"❌ Error with query '{query}': {e}")
            continue

    # Default to Mumbai coordinates if no location found (matching your existing data)
    print("⚠️ Using default Mumbai coordinates")
    return {"latitude": 19.0760, "longitude": 72.8777}

def save_fir_to_database(fir_data):
    """Save FIR data to MongoDB database in FLAT DOCUMENT format matching your backend exactly"""
    try:
        # Create flat document structure exactly like your backend expects
        document = {
            "fir_number": fir_data['fir_number'],
            "police_station": fir_data['police_station'],
            "district": fir_data['district'],
            "incident_date": fir_data['incident_date'],
            "incident_time": fir_data['incident_time'],
            "crime_type": fir_data['crime_type'],
            "sections": fir_data['sections'],
            "description": fir_data['description'],
            "status": fir_data['status'],
            "latitude": fir_data['latitude'],
            "longitude": fir_data['longitude'],
            "processed_at": datetime.now(),
            "created_at": datetime.now(),
            "source": "OCR_PROCESSING"
        }

        # Insert into the EXACT same collection your backend uses: fir_data.firs
        result = fir_collection.insert_one(document)

        print(f"✅ Saved FIR to database: {fir_data['fir_number']} at coordinates [{fir_data['longitude']}, {fir_data['latitude']}]")
        print(f"✅ Database: fir_data, Collection: firs, Document ID: {result.inserted_id}")

        return {
            'success': True,
            'inserted_id': str(result.inserted_id),
            'document': document
        }
    except Exception as e:
        print(f"❌ Database error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# HTML template for the upload form
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>FIR Multi-Agent OCR System</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .upload-form {
            padding: 40px;
            text-align: center;
        }
        .file-input-wrapper {
            position: relative;
            display: inline-block;
            margin: 20px 0;
        }
        .file-input {
            position: absolute;
            left: -9999px;
        }
        .file-input-label {
            display: inline-block;
            padding: 15px 30px;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #6c757d;
            font-weight: 500;
        }
        .file-input-label:hover {
            background: #e9ecef;
            border-color: #2196F3;
            color: #2196F3;
        }
        .submit-btn {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
            margin-top: 20px;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            background: #343a40;
            color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
        }
        .error { color: #dc3545; }
        .success { color: #28a745; }
        .loading {
            text-align: center;
            padding: 40px;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2196F3;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚔 FIR OCR Processing System</h1>
            <p>Upload a FIR document image to extract and process crime data</p>
        </div>

        <div class="upload-form">
            <form id="uploadForm" enctype="multipart/form-data">
                <div class="file-input-wrapper">
                    <input type="file" id="fileInput" name="file" accept="image/*" required class="file-input">
                    <label for="fileInput" class="file-input-label">
                        📄 Choose FIR Document Image
                    </label>
                </div>
                <br>
                <button type="submit" class="submit-btn">🔍 Process FIR Document</button>
            </form>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div class="spinner"></div>
            <h3>Processing FIR Document...</h3>
            <p>This may take a few moments while we extract and analyze the crime data.</p>
        </div>

        <div id="result" class="result" style="display: none;"></div>
    </div>

    <script>
        document.getElementById('fileInput').onchange = function() {
            const fileName = this.files[0]?.name || '';
            const label = document.querySelector('.file-input-label');
            if (fileName) {
                label.textContent = '📄 ' + fileName;
                label.style.color = '#28a745';
                label.style.borderColor = '#28a745';
            }
        };

        document.getElementById('uploadForm').onsubmit = function(e) {
            e.preventDefault();

            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a FIR document image');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';

            fetch('/process-fir', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';

                if (data.error) {
                    document.getElementById('result').innerHTML =
                        '<h3 class="error">❌ Error:</h3><pre>' + data.error + '</pre>';
                } else {
                    document.getElementById('result').innerHTML =
                        '<h3 class="success">✅ FIR Processing Complete!</h3>' +
                        '<h4>🎯 Extracted Crime Data:</h4><pre>' + JSON.stringify(data.fir_data, null, 2) + '</pre>' +
                        '<h4>📍 Location Coordinates:</h4><pre>Latitude: ' + data.fir_data.latitude + ', Longitude: ' + data.fir_data.longitude + '</pre>' +
                        '<h4>💾 Database Status:</h4><pre>' + JSON.stringify(data.database_result, null, 2) + '</pre>';
                }
            })
            .catch(error => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';
                document.getElementById('result').innerHTML =
                    '<h3 class="error">❌ Error:</h3><pre>' + error + '</pre>';
            });
        };
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Serve the upload form"""
    return render_template_string(HTML_TEMPLATE)

@app.route('/process-fir', methods=['POST'])
def process_fir_image():
    """Process uploaded FIR document image"""

    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Read and encode the image
        image_data = base64.b64encode(file.read()).decode('utf-8')

        # Step 1: Perform OCR
        print("Step 1: Performing FIR OCR...")
        extracted_text = qwen_multilingual_ocr(image_data)

        # Step 2: Detect language
        print("Step 2: Detecting language...")
        language = detect_language(extracted_text)

        # Step 3: Translate to English if needed
        print("Step 3: Translating to English...")
        translated_text = translate_to_english(extracted_text, language)

        # Step 4: Convert to FIR JSON
        print("Step 4: Converting to FIR JSON...")
        json_response = convert_to_fir_json(translated_text)

        # Parse the JSON response
        try:
            parsed_json = json.loads(json_response)
        except json.JSONDecodeError:
            return jsonify({'error': 'Failed to parse FIR JSON response', 'raw_response': json_response}), 500

        # Step 5: Get coordinates
        print("Step 5: Getting coordinates...")
        coords = get_coordinates_from_location(parsed_json)

        # Add coordinates to JSON
        parsed_json["latitude"] = coords.get("latitude")
        parsed_json["longitude"] = coords.get("longitude")

        # Step 6: Save to database
        print("Step 6: Saving to database...")
        database_result = save_fir_to_database(parsed_json)
        
        # Convert ObjectId to string before returning
        if '_id' in parsed_json:
            parsed_json['_id'] = str(parsed_json['_id'])

        # Clean database result for JSON serialization
        clean_db_result = {
            'success': database_result.get('success', False),
            'inserted_id': database_result.get('inserted_id', ''),
            'message': 'FIR saved successfully to database' if database_result.get('success') else 'Failed to save FIR'
        }

        return jsonify({
            'success': True,
            'extracted_text': extracted_text,
            'language': language,
            'translated_text': translated_text,
            'fir_data': parsed_json,
            'database_result': clean_db_result
        })

    except Exception as e:
        print(f"Error processing FIR image: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/process-fir', methods=['POST'])
def api_process_fir():
    """API endpoint for processing FIR documents"""

    try:
        data = request.get_json()

        if 'image_base64' not in data:
            return jsonify({'error': 'image_base64 field required'}), 400

        image_data = data['image_base64']

        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]

        # Step 1: Perform OCR
        extracted_text = qwen_multilingual_ocr(image_data)

        # Step 2: Detect language
        language = detect_language(extracted_text)

        # Step 3: Translate to English
        translated_text = translate_to_english(extracted_text, language)

        # Step 4: Convert to FIR JSON
        json_response = convert_to_fir_json(translated_text)

        # Parse the JSON response
        parsed_json = json.loads(json_response)

        # Step 5: Get coordinates
        coords = get_coordinates_from_location(parsed_json)

        # Add coordinates to JSON
        parsed_json["latitude"] = coords.get("latitude")
        parsed_json["longitude"] = coords.get("longitude")

        # Step 6: Save to database
        database_result = save_fir_to_database(parsed_json)
        
        # Convert ObjectId to string before returning
        if '_id' in parsed_json:
            parsed_json['_id'] = str(parsed_json['_id'])

        # Clean database result for JSON serialization
        clean_db_result = {
            'success': database_result.get('success', False),
            'inserted_id': database_result.get('inserted_id', ''),
            'message': 'FIR saved successfully to database' if database_result.get('success') else 'Failed to save FIR'
        }

        return jsonify({
            'success': True,
            'data': parsed_json,
            'database_result': clean_db_result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)