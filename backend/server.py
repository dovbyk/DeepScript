from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from text_rendering import render_text
from font_generator import generate_font 
from werkzeug.utils import secure_filename
import io
import json

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://deepscript.vercel.app"}})

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)



@app.route('/render', methods=['POST'])
def render():
    if 'input_text' not in request.form or 'fontfile' not in request.files:
        return jsonify({'error': 'Missing input_text or fontfile'}), 400
    input_text = request.form['input_text'].replace("\r\n", "\n")
    fontfile = request.files['fontfile']
    font_path = os.path.join(UPLOAD_FOLDER, fontfile.filename)
    fontfile.save(font_path)
    output_path = os.path.join(OUTPUT_FOLDER, 'rendered_output.pdf')
    output_file = render_text(input_text, font_path, output_path)
    return send_file(output_file, as_attachment=True, mimetype='application/pdf')


@app.route('/generate-font', methods=['POST'])
def generate_font_endpoint():
    """
    Expects multipart/form-data with:
    - image files
    - new_names: JSON list of new names in the same order as the uploaded files
    """
    if 'new_names' not in request.form:
        return jsonify({"error": "Missing 'new_names' field"}), 400

    try:
        new_names = json.loads(request.form['new_names'])
    except Exception:
        return jsonify({"error": "Invalid 'new_names' JSON format"}), 400

    files = request.files.getlist("images")
    if not files or len(files) != len(new_names):
        return jsonify({"error": "Mismatch between files and new_names"}), 400

    png_file_items = []
    for file, new_name in zip(files, new_names):
        if file.filename == '':
            continue
        # Secure and read the file
        filename = secure_filename(new_name)
        file_bytes = io.BytesIO(file.read())  # ✅ read content
        png_file_items.append({
            "file": file_bytes,  # Pass file-like object
            "new_name": filename
        })

    return generate_font(png_file_items)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
