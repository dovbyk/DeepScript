import os
import subprocess
from PIL import Image, ImageStat, ImageOps
from fontTools.ttLib import newTable 
import psMat
from flask import send_file

# Temporary directories and output font path
BMP_TEMP_DIR = "bmp_output_temp"
SVG_TEMP_DIR = "svg_output_temp"
OUTPUT_FONT_PATH = os.path.join("output", "CustomFont3.ttf")

os.makedirs(BMP_TEMP_DIR, exist_ok=True)
os.makedirs(SVG_TEMP_DIR, exist_ok=True)
os.makedirs("output", exist_ok=True)

def convert_png_to_bmp(input_path, output_path):
    """
    Convert PNG to BMP (grayscale and binarized).
    If the image is dark (likely a black background), invert it.
    """
    img = Image.open(input_path).convert("L")
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
    Expects a list of dictionaries with keys "original_path" and "new_name".
    For each item, convert the PNG to BMP and then to SVG.
    The SVG is saved using the base name (extension removed) of the provided new_name.
    """
    for item in png_file_items:
        original_path = item.get("original_path")
        new_name = item.get("new_name")
        if not original_path or not os.path.exists(original_path):
            print(f"PNG file does not exist: {original_path}")
            continue
        if new_name and isinstance(new_name, str):
            base_name, _ = os.path.splitext(new_name)
        else:
            base_name, _ = os.path.splitext(os.path.basename(original_path))
        bmp_path = os.path.join(BMP_TEMP_DIR, base_name + ".bmp")
        svg_path = os.path.join(SVG_TEMP_DIR, base_name + ".svg")
        convert_png_to_bmp(original_path, bmp_path)
        convert_bmp_to_svg(bmp_path, svg_path)

def generate_font(png_file_items):
    process_png_files(png_file_items)

    # Build glyph_map (same as before)
    glyph_map = {}
    for item in png_file_items:
        new_name = item.get("new_name")
        if new_name and isinstance(new_name, str):
            base_name, _ = os.path.splitext(new_name)
            if len(base_name) == 1:
                glyph_map[base_name] = f"{base_name}.svg"
            else:
                print(f"Warning: Skipping invalid character {new_name}")
        else:
            print(f"Warning: Invalid new_name {new_name}")

    # Create font using fontTools
    font = TTFont()
    if "glyf" not in font:
        font["glyf"] = newTable("glyf")
    glyf_table = font["glyf"]
    
    
    hmtx_table = font["hmtx"] = font.get("hmtx") or newTable("hmtx")
    cmap_table = font["cmap"] = font.get("cmap") or newTable("cmap")
    
    units_per_em = 1000
    ascent = 800
    descent = 200
    font["head"].unitsPerEm = units_per_em
    font["hhea"].ascent = ascent
    font["hhea"].descent = -descent
    font["OS/2"].sTypoAscender = ascent
    font["OS/2"].sTypoDescender = -descent
    font["OS/2"].usWinAscent = ascent
    font["OS/2"].usWinDescent = descent

    # Process each glyph
    for char, svg_filename in glyph_map.items():
        svg_path = os.path.join(SVG_TEMP_DIR, svg_filename)
        if not os.path.exists(svg_path):
            print(f"Skipping missing SVG: {svg_path}")
            continue

        # Parse SVG path
        with open(svg_path) as f:
            svg_data = f.read()
        path = parse_path(SVGPath.fromstring(svg_data).d)

        # Create glyph
        glyph_name = f"uni{ord(char):04X}"
        pen = TTGlyphPen(font.getGlyphSet())
        for segment in path:
            if isinstance(segment, Line):
                pen.lineTo((segment.end.real, segment.end.imag))
            elif isinstance(segment, CubicBezier):
                pen.curveTo(
                    (segment.control1.real, segment.control1.imag),
                    (segment.control2.real, segment.control2.imag),
                    (segment.end.real, segment.end.imag)
                )

        # Apply scaling/positioning (same logic as before)
        bbox = pen.glyph.bbox
        glyph_height = bbox[3] - bbox[1]
        glyph_width = bbox[2] - bbox[0]
        
        scale_factor = get_scale_factors(char, glyph_height, glyph_width)
        if char in descender_chars:
            scale_factor *= 1.5

        # Transform glyph
        for contour in pen.glyph:
            for point in contour.points:
                point.x *= scale_factor
                point.y *= scale_factor
                if char in descender_chars:
                    point.y += (200 - (glyph_height * scale_factor * 2/3))

        # Add to font
        glyf_table[glyph_name] = pen.glyph
        hmtx_table[glyph_name] = (int(glyph_width * scale_factor + 100), 0)
        cmap_table.cmap[4, 3][ord(char)] = glyph_name

    # Save and return
    font.save(OUTPUT_FONT_PATH)
    return send_file(OUTPUT_FONT_PATH, as_attachment=True, mimetype="font/ttf")
