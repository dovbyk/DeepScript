from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from text_rendering import render_text
from font_generator import generate_font 
import zipfile
import shutil
import tempfile


app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://betadeep-virid.vercel.app"}})

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route('/receive-uploads', methods=['POST'])
def receive_uploads():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    temp_dir = tempfile.mkdtemp()  # Temporary directory for extraction
    zip_path = os.path.join(temp_dir, 'uploads.zip')
    file.save(zip_path)

    # Extract ZIP to temp_dir/uploads
    extracted_uploads_dir = os.path.join(temp_dir, 'uploads')
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extracted_uploads_dir)

    # Path to the receiver's actual uploads directory
    receiver_uploads = os.path.abspath('uploads')

    # Remove the existing uploads directory and its contents
    if os.path.exists(receiver_uploads):
        shutil.rmtree(receiver_uploads)

    # Move the extracted uploads directory to the receiver's uploads path
    shutil.move(extracted_uploads_dir, receiver_uploads)

    # Clean up the temp directory
    shutil.rmtree(temp_dir, ignore_errors=True)

    print("Uploads directory received and replaced")
    
    return jsonify({'status': 'success', 'message': 'Uploads directory replaced with received data.'})


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
    print(png_files)
    return generate_font(png_files)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
