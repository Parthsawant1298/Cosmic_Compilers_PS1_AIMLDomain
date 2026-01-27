from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import base64
import json
import requests
from openai import OpenAI
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # Allow requests from Next.js frontend
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# OpenRouter API key - you should use environment variables in production
OPENROUTER_API_KEY = "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"

# System prompt for OCR
SYSTEM_PROMPT = """Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements. Extract text in ALL languages present in the image (including Marathi, Hindi, Odia, English, Tamil, Malayalam, or any other language).

Requirements:
- Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
- No Delimiters: Do not use code fences or delimiters like ```markdown.
- Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
- Language Support: Accurately extract text in any language present in the image."""

def qwen_multilingual_ocr(image_data):
    """Perform OCR using Qwen-2-VL-72B model"""
    
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
                    "text": "Please perform OCR on this image and extract all visible text accurately in any language (Marathi, Hindi, English, Tamil, Malayalam, Telugu, Gujarati, Bengali, Kannada, Odia, Punjabi, etc.). Only provide the extracted text, nothing else."
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
        "content": "you are expert in language detection so which with the given text by user analyze the language and give where it belongs to okay ?"
    },
    {
        "role": "user",
        "content": f"which language is this {text} just mention the language like just name of the language nothing else.STRICITLY DONT MENTION ANYTHING ELSE THAN THE LANGUAGE NAME DONT GIVE ANY SENTENCE JUST IN ONE WORD GIVE LANGUAGE NAME "
    }]

    response = language_detection.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return response.choices[0].message.content.strip()

def translate_to_english(text, language):
    """Translate text to English while preserving structure"""
    
    language_translate_agent = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )
    
    messages = [{
        "role": "system",
        "content": "You are a helpful assistant that translates any language into english and dont change the structure just translate into english"
    },
    {
        "role": "user",
        "content": f"translate this {text} which is in the language {language} into english"
    }]

    response = language_translate_agent.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return response.choices[0].message.content

def convert_to_json(translated_text):
    """Convert translated text to structured JSON"""
    
    json_agent = OpenAI(
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    messages = [{
        "role": "system",
        "content": f"""You are a helpful assistant that converts the entire form into json format as shown below:
        {{
          "form_type": "",
          "claimant_name": "",
          "spouse_name": "",
          "father_mother_name": "",
          "village": "",
          "gram_panchayat": "",
          "tehsil_taluka": "",
          "district": "",
          "state": "",
          "scheduled_tribe": "",
          "other_traditional_forest_dweller": "",
          "family_members": [
            {{"name": "", "age": "", "relation": ""}}
          ],
          "land_for_habitation": "",
          "land_for_cultivation": "",
          "total_land_claimed": "",
          "application_date": "",
          "claim_status": ""
        }}
        Return ONLY valid JSON without any markdown formatting or code blocks. Do not include a trailing comma after the last key-value pair.
        """
    },
    {
        "role": "user",
        "content": f"convert this {translated_text} into json format"
    }]

    response = json_agent.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    return response.choices[0].message.content

def get_coordinates_fallback(village, gram_panchayat, tehsil_taluka, district, state):
    """Get coordinates using fallback search approach"""
    
    # Try multiple search queries in order of specificity
    search_queries = [
        f"{village}, {district}, {state}",  # Most specific
        f"{district}, {state}",             # District level
        f"{tehsil_taluka}, {district}, {state}",  # Tehsil level
        f"{gram_panchayat}, {district}, {state}"  # GP level
    ]

    for query in search_queries:
        if not query.strip():
            continue

        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "fra-coordinates-fetcher/1.0"}

        try:
            print(f"Trying search: {query}")
            resp = requests.get(url, params=params, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()

            if data:
                print(f"Found coordinates: {data[0]['lat']}, {data[0]['lon']}")
                return {"latitude": data[0]["lat"], "longitude": data[0]["lon"]}

        except Exception as e:
            print(f"Error with query '{query}': {e}")
            continue

    return {"latitude": None, "longitude": None}

# HTML template for the upload form
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>FRA Multi-Agent OCR System</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        .container { max-width: 800px; margin: 0 auto; }
        .upload-form { border: 2px dashed #ccc; padding: 30px; text-align: center; }
        .result { margin-top: 30px; padding: 20px; background-color: #f5f5f5; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <div class="container">
        <h1>FRA Multi-Agent OCR System</h1>
        <p>Upload an FRA form image to extract and process the data</p>
        
        <div class="upload-form">
            <form id="uploadForm" enctype="multipart/form-data">
                <input type="file" id="fileInput" name="file" accept="image/*" required>
                <br><br>
                <button type="submit">Process FRA Form</button>
            </form>
        </div>
        
        <div id="loading" style="display: none;">
            <h3>Processing... This may take a few moments.</h3>
        </div>
        
        <div id="result" class="result" style="display: none;"></div>
    </div>

    <script>
        document.getElementById('uploadForm').onsubmit = function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a file');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            
            fetch('/process', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';
                
                if (data.error) {
                    document.getElementById('result').innerHTML = 
                        '<h3 class="error">Error:</h3><pre>' + data.error + '</pre>';
                } else {
                    document.getElementById('result').innerHTML = 
                        '<h3 class="success">Processing Complete!</h3>' +
                        '<h4>Extracted Text:</h4><pre>' + data.extracted_text.substring(0, 500) + '...</pre>' +
                        '<h4>Detected Language:</h4><pre>' + data.language + '</pre>' +
                        '<h4>Structured JSON Data:</h4><pre>' + JSON.stringify(data.structured_data, null, 2) + '</pre>';
                }
            })
            .catch(error => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('result').style.display = 'block';
                document.getElementById('result').innerHTML = 
                    '<h3 class="error">Error:</h3><pre>' + error + '</pre>';
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

@app.route('/process', methods=['POST'])
def process_image():
    """Process uploaded FRA form image"""
    
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
        print("Step 1: Performing OCR...")
        extracted_text = qwen_multilingual_ocr(image_data)
        
        # Step 2: Detect language
        print("Step 2: Detecting language...")
        language = detect_language(extracted_text)
        
        # Step 3: Translate to English
        print("Step 3: Translating to English...")
        translated_text = translate_to_english(extracted_text, language)
        
        # Step 4: Convert to JSON
        print("Step 4: Converting to JSON...")
        json_response = convert_to_json(translated_text)
        
        # Parse the JSON response
        try:
            parsed_json = json.loads(json_response)
        except json.JSONDecodeError:
            return jsonify({'error': 'Failed to parse JSON response', 'raw_response': json_response}), 500
        
        # Step 5: Get coordinates
        print("Step 5: Getting coordinates...")
        coords = get_coordinates_fallback(
            village=parsed_json.get("village", ""),
            gram_panchayat=parsed_json.get("gram_panchayat", ""),
            tehsil_taluka=parsed_json.get("tehsil_taluka", ""),
            district=parsed_json.get("district", ""),
            state=parsed_json.get("state", "")
        )
        
        # Add coordinates to JSON
        parsed_json["latitude"] = coords.get("latitude")
        parsed_json["longitude"] = coords.get("longitude")
        
        return jsonify({
            'success': True,
            'extracted_text': extracted_text,
            'language': language,
            'translated_text': translated_text,
            'structured_data': parsed_json
        })
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/process', methods=['POST'])
def api_process():
    """API endpoint for processing FRA forms"""
    
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
        
        # Step 4: Convert to JSON
        json_response = convert_to_json(translated_text)
        
        # Parse the JSON response
        parsed_json = json.loads(json_response)
        
        # Step 5: Get coordinates
        coords = get_coordinates_fallback(
            village=parsed_json.get("village", ""),
            gram_panchayat=parsed_json.get("gram_panchayat", ""),
            tehsil_taluka=parsed_json.get("tehsil_taluka", ""),
            district=parsed_json.get("district", ""),
            state=parsed_json.get("state", "")
        )
        
        # Add coordinates to JSON
        parsed_json["latitude"] = coords.get("latitude")
        parsed_json["longitude"] = coords.get("longitude")
        
        return jsonify({
            'success': True,
            'data': parsed_json
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)