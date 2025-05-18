import os
import subprocess
import traceback
from PIL import Image, ImageStat, ImageOps
from flask import send_file, jsonify
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables._n_a_m_e import NameRecord
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
    if char in uppercase_chars or char in ascender_chars:
        height_target = 700
        width_target = 600
    elif char in descender_chars:
        height_target = 500
        width_target = 500
    else:
        height_target = 500
        width_target = 500
    return min(
        height_target / glyph_height if glyph_height > 0 else 1,
        width_target / glyph_width if glyph_width > 0 else 1
    )

def convert_png_to_bmp(input_path, output_path):
    img = Image.open(input_path).convert("L")
    stat = ImageStat.Stat(img)
    if stat.mean[0] < 128:
        img = ImageOps.invert(img)
    img.point(lambda p: 255 if p > 128 else 0).save(output_path, "BMP")

def convert_bmp_to_svg(bmp_path, svg_path):
    subprocess.run(["potrace", bmp_path, "-s", "-o", svg_path], check=True)

def process_png_files(png_file_items):
    for item in png_file_items:
        original_path = item.get("original_path")
        new_name = item.get("new_name", "")
        if not original_path or not os.path.exists(original_path):
            continue
            
        base_name = os.path.splitext(new_name)[0] if new_name else \
                   os.path.splitext(os.path.basename(original_path))[0]
        
        bmp_path = os.path.join(BMP_TEMP_DIR, f"{base_name}.bmp")
        svg_path = os.path.join(SVG_TEMP_DIR, f"{base_name}.svg")
        
        convert_png_to_bmp(original_path, bmp_path)
        convert_bmp_to_svg(bmp_path, svg_path)

def generate_font(png_file_items):
    try:
        process_png_files(png_file_items)

        glyph_map = {}
        for item in png_file_items:
            new_name = item.get("new_name", "")
            if len(new_name) == 1:
                glyph_map[new_name] = f"{new_name}.svg"

        font = TTFont()
        font["head"] = newTable("head")
        font["glyf"] = newTable("glyf")
        font["hmtx"] = newTable("hmtx")
        font["cmap"] = cmap = newTable("cmap")
        font["name"] = name = newTable("name")

        # Font metrics
        units_per_em = 1000
        font["head"].unitsPerEm = units_per_em
        font["head"].created = 0
        font["head"].modified = 0
        
        # Vertical metrics
        font["hhea"] = newTable("hhea")
        font["hhea"].ascent = 800
        font["hhea"].descent = -200
        font["hhea"].height = 1000
        
        # OS/2 table
        font["OS/2"] = os2 = newTable("OS/2")
        os2.version = 4
        os2.sTypoAscender = 800
        os2.sTypoDescender = -200
        os2.usWinAscent = 800
        os2.usWinDescent = 200
        os2.sxHeight = 500
        os2.fsSelection = 0b00000000_00000000
        
        # Name table - CORRECTED SECTION
        name.names = []
        
        # Family Name
        nr1 = NameRecord()
        nr1.platformID = 3
        nr1.platEncID = 1
        nr1.langID = 0x409
        nr1.nameID = 1
        nr1.string = "CustomFont"
        name.names.append(nr1)
        
        # Full Name
        nr2 = NameRecord()
        nr2.platformID = 3
        nr2.platEncID = 1
        nr2.langID = 0x409
        nr2.nameID = 4
        nr2.string = "CustomFont Regular"
        name.names.append(nr2)
        
        # PostScript Name
        nr3 = NameRecord()
        nr3.platformID = 3
        nr3.platEncID = 1
        nr3.langID = 0x409
        nr3.nameID = 6
        nr3.string = "CustomFont-Regular"
        name.names.append(nr3)

        # Character mapping
        cmap.tableVersion = 0
        cmap.tables = []
        cmap.addcmap(3, 1, {})

        for char, svg_filename in glyph_map.items():
            svg_path = os.path.join(SVG_TEMP_DIR, svg_filename)
            if not os.path.exists(svg_path):
                continue

            with open(svg_path) as f:
                path = parse_path(SVGPath.fromstring(f.read()).d)

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
            bbox = glyph.bbox
            if not bbox:
                continue

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
            cmap.cmap[3, 1][ord(char)] = glyph_name

        if not font["glyf"].glyphs:
            raise ValueError("No valid glyphs created")

        font.save(OUTPUT_FONT_PATH)
        return send_file(OUTPUT_FONT_PATH, mimetype="font/ttf", as_attachment=True)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Font generation failed: {str(e)}"}), 500
