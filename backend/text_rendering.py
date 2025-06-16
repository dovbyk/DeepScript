from PIL import Image, ImageDraw, ImageFont
import os
import random

def apply_text_shadow(draw, text, position, font, shadow_offset=(2, 2), shadow_color='gray'):
    shadow_x, shadow_y = position[0] + shadow_offset[0], position[1] + shadow_offset[1]
    draw.text((shadow_x, shadow_y), text, font=font, fill=shadow_color)



def render_text(input_text, font_path, output_path):
    print(input_text)
    width, height = 2680, 3508
    x, y = 50, 50
    pages = []
    line_spacing, paragraph_spacing = 75, 50
    
    def create_new_page():
        page = Image.new("RGB", (width, height), "white")
        pages.append(page)
        return page, ImageDraw.Draw(page)
    
    image, draw = create_new_page()
    paragraphs = input_text.split("\n")
    
    for paragraph in paragraphs:
        words = paragraph.split(" ")
        
        for word in words:
            font_size = random.randint(100, 100)
            font = ImageFont.truetype(font_path, size=font_size)
            bbox = draw.textbbox((0, 0), word, font=font)
            word_width, word_height = bbox[2] - bbox[0], bbox[3] - bbox[1]
            word_width -= 10 * len(word)
            
            if x + word_width > 2630:
                x, y = 50 + random.randint(0, 50), y + line_spacing
            
            if y + word_height > 3400:
                image, draw = create_new_page()
                x, y = 50, 50
            
            for char in word:
                bbox = draw.textbbox((0, 0), char, font=font)
                char_width = bbox[2] - bbox[0]
                apply_text_shadow(draw, char, (x, y ), font)
                draw.text((x, y), char, font=font, fill='blue')
                x += char_width - 10
            
            space_bbox = draw.textbbox((0, 0), " ", font=font)
            space_width = space_bbox[2] - space_bbox[0]
            x += space_width + random.randint(1, 90)
        
        x, y = 50, y + word_height + paragraph_spacing
    
    pdf_output = output_path.replace(".png", ".pdf")
    pages[0].save(pdf_output, save_all=True, append_images=pages[1:])
    return pdf_output
