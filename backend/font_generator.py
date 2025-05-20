import os
import subprocess
from PIL import Image, ImageStat, ImageOps
import fontforge
import psMat
from flask import send_file

# Temporary directories and output font path
BMP_TEMP_DIR = "bmp_output_temp"
SVG_TEMP_DIR = "svg_output_temp"
OUTPUT_FONT_PATH = os.path.join("output", "CustomFont3.ttf")

os.makedirs(BMP_TEMP_DIR, exist_ok=True)
os.makedirs(SVG_TEMP_DIR, exist_ok=True)
os.makedirs("output", exist_ok=True)

def convert_png_file_to_bmp(file_stream, output_path):
    """Convert in-memory PNG file to BMP (grayscale, binarized)."""
    file_stream.seek(0)
    img = Image.open(file_stream).convert("L")
    stat = ImageStat.Stat(img)
    avg_brightness = stat.mean[0]
    if avg_brightness < 128:
        img = ImageOps.invert(img)
    img = img.point(lambda p: 255 if p > 128 else 0)
    img.save(output_path, format="BMP")
    print(f"Converted to BMP: {output_path}")

def convert_bmp_to_svg(bmp_path, svg_path):
    """Convert BMP to SVG using Potrace."""
    command = ["potrace", bmp_path, "-s", "-o", svg_path]
    subprocess.run(command, check=True)
    print(f"Converted to SVG: {svg_path}")

def process_png_files(png_file_items):
    """
    Expects a list of dictionaries with keys "file" (file-like) and "new_name".
    Converts to BMP and SVG using in-memory files.
    """
    for item in png_file_items:
        file_stream = item.get("file")
        new_name = item.get("new_name")
        if not file_stream or not new_name:
            continue

        base_name, _ = os.path.splitext(new_name)
        bmp_path = os.path.join(BMP_TEMP_DIR, base_name + ".bmp")
        svg_path = os.path.join(SVG_TEMP_DIR, base_name + ".svg")

        convert_png_file_to_bmp(file_stream, bmp_path)
        convert_bmp_to_svg(bmp_path, svg_path)


def generate_font(png_file_items):
    """
    Receives a list of dictionaries with keys "original_path" and "new_name".
    Converts the PNG files (using the new names) to SVG files and then uses them to
    generate a TTF font. Returns a Flask response sending the TTF file.
    """
    # Convert PNGs to SVGs
    process_png_files(png_file_items)

    # Build glyph_map from the provided items.
    glyph_map = {}
    for item in png_file_items:
        new_name = item.get("new_name")
        if new_name and isinstance(new_name, str):
            base_name, _ = os.path.splitext(new_name)
            if len(base_name) == 1:
                glyph_map[base_name] = f"{base_name}.svg"
            else:
                print(f"Warning: new_name '{new_name}' (base '{base_name}') is not a single character. Skipping this item.")
        else:
            print(f"Warning: new_name '{new_name}' is not valid. Skipping this item.")

    # Define character sets
    uppercase_chars = set('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    ascender_chars = set('bdfhklt')
    descender_chars = set('gpqy')

    def get_scale_factors(char, glyph_height, glyph_width):
        if char in uppercase_chars or char in ascender_chars:
            height_target = 700
            width_target = 600
        elif char in descender_chars:
            height_target = 500
            width_target = 500
        else:
            height_target = 500
            width_target = 500
        height_scale = height_target / glyph_height if glyph_height > 0 else 1
        width_scale = width_target / glyph_width if glyph_width > 0 else 1
        return min(height_scale, width_scale)

    def position_glyph(glyph, char):
        bbox = glyph.boundingBox()
        if char in descender_chars:
            main_body_height = (bbox[3] - bbox[1]) * 2/3
            baseline_shift = 200 - main_body_height
        else:
            baseline_shift = 0
        glyph.transform(psMat.translate(0, baseline_shift))

    # Create a new font
    font = fontforge.font()
    font.familyname = "CustomFont"
    font.fullname = "CustomFont Regular"
    font.fontname = "CustomFont-Regular"
    font.em = 1000
    font.ascent = 800
    font.descent = 200

    # Create glyphs using the glyph_map.
    for char, svg_filename in glyph_map.items():
        svg_path = os.path.join(SVG_TEMP_DIR, svg_filename)
        if not os.path.exists(svg_path):
            print(f"SVG file not found: {svg_path}. Skipping {char}.")
            continue

        glyph = font.createChar(ord(char), char)
        glyph.importOutlines(svg_path)

        bbox = glyph.boundingBox()
        glyph_width = bbox[2] - bbox[0]
        glyph_height = bbox[3] - bbox[1]
        scale_factor = get_scale_factors(char, glyph_height, glyph_width)
        if char in descender_chars:
            scale_factor *= 1.5
        glyph.transform(psMat.scale(scale_factor))
        position_glyph(glyph, char)
        new_bbox = glyph.boundingBox()
        new_width = new_bbox[2] - new_bbox[0]
        glyph.width = int(new_width + 100)

    # Set font-wide metrics.
    font.hhea_ascent = font.ascent
    font.hhea_descent = -font.descent
    font.os2_typoascent = font.ascent
    font.os2_typodescent = -font.descent
    font.os2_winascent = font.ascent
    font.os2_windescent = font.descent
    font.os2_xheight = 500

    font.generate(OUTPUT_FONT_PATH)
    print(f"Font saved as {OUTPUT_FONT_PATH}")

    return send_file(OUTPUT_FONT_PATH, as_attachment=True, mimetype="font/ttf")
