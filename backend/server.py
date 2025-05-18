from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from character_segmentation import process_uploaded_image
from text_rendering import render_text
from font_generator import generate_font  # Import the generate_font function

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://betadeep-virid.vercel.app"}})

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    processed_images = process_uploaded_image(file_path)
    return jsonify({'processed_images': processed_images})

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

@app.route('/get-image', methods=['GET'])
def get_image():
    image_path = request.args.get('path')
    if not image_path or not os.path.exists(image_path):
        return jsonify({'error': 'Image not found'}), 404
    return send_file(image_path, mimetype='image/png')

@app.route('/generate-font', methods=['POST'])
def generate_font_endpoint():
    """
    Expects a JSON payload with:
    {
       "png_files": [ { "original_path": "<path>", "new_name": "<new_name>" }, ... ]
    }
    The generate_font() function will process these PNG files and return the generated TTF file.
    """
    data = request.get_json()
    png_files = data.get("png_files")
    if not png_files or not isinstance(png_files, list):
        return jsonify({"error": "No png_files provided"}), 400
    return generate_font(png_files)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
