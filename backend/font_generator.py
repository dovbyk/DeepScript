import os
import subprocess
import traceback
from PIL import Image, ImageStat, ImageOps
from flask import send_file, jsonify
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables._n_a_m_e import NameRecord
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib import SVGPath
from svgpathtools import parse_path, Line, CubicBezier

# Constants
BMP_TEMP_DIR = "bmp_output_temp"
SVG_TEMP_DIR = "svg_output_temp"
OUTPUT_FONT_PATH = os.path.join("output", "CustomFont.ttf")
uppercase_chars = set('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
ascender_chars = set('bdfhklt')
descender_chars = set('gpqy')

# Create directories
os.makedirs(BMP_TEMP_DIR, exist_ok=True)
os.makedirs(SVG_TEMP_DIR, exist_ok=True)
os.makedirs("output", exist_ok=True)

def get_scale_factors(char, glyph_height, glyph_width):
    try:
        if char in uppercase_chars or char in ascender_chars:
            return min(700/glyph_height, 600/glyph_width) if glyph_height > 0 and glyph_width > 0 else 1
        elif char in descender_chars:
            return min(500/glyph_height, 500/glyph_width) if glyph_height > 0 and glyph_width > 0 else 1
        return min(500/glyph_height, 500/glyph_width) if glyph_height > 0 and glyph_width > 0 else 1
    except ZeroDivisionError:
        return 1

def convert_png_to_bmp(input_path, output_path):
    try:
        img = Image.open(input_path).convert("L")
        if ImageStat.Stat(img).mean[0] < 128:
            img = ImageOps.invert(img)
        img.point(lambda p: 255 if p > 128 else 0).save(output_path, "BMP")
        return True
    except Exception as e:
        print(f"PNG->BMP Conversion Error: {str(e)}")
        return False

def convert_bmp_to_svg(bmp_path, svg_path):
    try:
        subprocess.run(["potrace", bmp_path, "-s", "-o", svg_path], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"BMP->SVG Conversion Error: {str(e)}")
        return False

def process_png_files(png_file_items):
    for item in png_file_items:
        if not item.get("original_path") or not os.path.exists(item["original_path"]):
            continue
            
        base_name = os.path.splitext(item.get("new_name", ""))[0] or \
                   os.path.splitext(os.path.basename(item["original_path"]))[0]
        
        bmp_path = os.path.join(BMP_TEMP_DIR, f"{base_name}.bmp")
        svg_path = os.path.join(SVG_TEMP_DIR, f"{base_name}.svg")
        
        if convert_png_to_bmp(item["original_path"], bmp_path):
            convert_bmp_to_svg(bmp_path, svg_path)

def generate_font(png_file_items):
    try:
        process_png_files(png_file_items)

        # Validate and build glyph map
        glyph_map = {}
        for item in png_file_items:
            new_name = item.get("new_name", "")
            if len(new_name) == 1:
                glyph_map[new_name] = f"{new_name}.svg"

        if not glyph_map:
            return jsonify({"error": "No valid glyphs provided"}), 400

        # Font initialization
        font = TTFont()
        font["head"] = newTable("head")
        font["glyf"] = newTable("glyf")
        font["hmtx"] = newTable("hmtx")
        font["cmap"] = newTable("cmap")
        font["name"] = newTable("name")
        font["OS/2"] = newTable("OS/2")
        font["hhea"] = newTable("hhea")

        # Font metrics
        font["head"].unitsPerEm = 1000
        font["hhea"].ascent = 800
        font["hhea"].descent = -200
        font["hhea"].lineGap = 0
        
        # OS/2 table
        os2 = font["OS/2"]
        os2.version = 4
        os2.sTypoAscender = 800
        os2.sTypoDescender = -200
        os2.usWinAscent = 800
        os2.usWinDescent = 200
        os2.sxHeight = 500

        # Name table
        name = font["name"]
        name.names = []
        for params in [
            (1, "CustomFont"),
            (4, "CustomFont Regular"),
            (6, "CustomFont-Regular")
        ]:
            nr = NameRecord()
            nr.platformID = 3
            nr.platEncID = 1
            nr.langID = 0x409
            nr.nameID, nr.string = params
            name.names.append(nr)

        # CMAP table
        cmap = font["cmap"]
        cmap.tableVersion = 0
        cmap.tables = []
        
        cmap_table = CmapSubtable.newSubtable(4)
        cmap_table.platformID = 3
        cmap_table.platEncID = 1
        cmap_table.language = 0
        cmap_table.cmap = {}
        cmap.tables.append(cmap_table)

        # Glyph processing
        for char, svg_filename in glyph_map.items():
            svg_path = os.path.join(SVG_TEMP_DIR, svg_filename)
            if not os.path.exists(svg_path):
                continue

            with open(svg_path) as f:
                svg_content = f.read()
                path = parse_path(SVGPath.fromstring(svg_content).d)

            pen = TTGlyphPen(None)
            for seg in path:
                if isinstance(seg, Line):
                    pen.lineTo((seg.end.real, seg.end.imag))
                elif isinstance(seg, CubicBezier):
                    pen.curveTo(
                        (seg.control1.real, seg.control1.imag),
                        (seg.control2.real, seg.control2.imag),
                        (seg.end.real, seg.end.imag)
                    )

            glyph = pen.glyph()
            if not glyph.bbox:
                continue

            # Calculate transformations
            bbox = glyph.bbox
            glyph_height = bbox[3] - bbox[1]
            glyph_width = bbox[2] - bbox[0]
            scale_factor = get_scale_factors(char, glyph_height, glyph_width)

            if char in descender_chars:
                scale_factor *= 1.5
                main_body_height = glyph_height * scale_factor * 2/3
                y_shift = 200 - main_body_height
            else:
                y_shift = 0

            # Apply transformations
            for contour in glyph:
                for point in contour.points:
                    point.x *= scale_factor
                    point.y = (point.y * scale_factor) + y_shift

            glyph_name = f"uni{ord(char):04X}"
            font["glyf"].glyphs[glyph_name] = glyph
            font["hmtx"].metrics[glyph_name] = (int(glyph_width * scale_factor + 100), 0)
            cmap_table.cmap[ord(char)] = glyph_name

        if not font["glyf"].glyphs:
            raise ValueError("No valid glyphs created")

        font.save(OUTPUT_FONT_PATH)
        return send_file(OUTPUT_FONT_PATH, mimetype="font/ttf", as_attachment=True)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Font generation failed: {str(e)}"}), 500
