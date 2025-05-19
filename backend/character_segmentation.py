# import cv2
# import os
# import numpy as np
# import google.generativeai as genai

# genai.configure(api_key="AIzaSyCsFPJPRlBKFF3p7ARWo89zNPXUtsYyz40")

# def recognize_character_from_image(image_path):
#     model = genai.GenerativeModel("gemini-2.0-flash")

#     with open(image_path, "rb") as f:
#         image_data = f.read()

#     image_content = {
#         "mime_type": "image/png",  
#         "data": image_data
#     }

#     response = model.generate_content([
#         "What single handwritten character (a-z, A-Z, 0-9) is shown in this image? Only provide the character/number in response and nothing else",
#         image_content
#     ])

#     character = response.text.strip()

#     if len(character) != 1:
#         print(f"Warning: Gemini returned multiple characters or unexpected result: '{character}'")
#         character = character[0]  # take only the first character

#     return character




# def process_uploaded_image(input_image_path):
#     output_directory = "processed_characters"
#     if not os.path.exists(output_directory):
#         os.makedirs(output_directory)
    
#     image = cv2.imread(input_image_path)
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     _, binary_image = cv2.threshold(gray_image, 127, 255, cv2.THRESH_BINARY_INV)
    
#     kernel = np.ones((3, 3), np.uint8)
#     binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, kernel)
#     binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_CLOSE, kernel)
    
#     contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#     bounding_boxes = [cv2.boundingRect(c) for c in contours]
    
#     def merge_close_boxes(boxes, threshold=20):
#         merged_boxes = []
#         for box in boxes:
#             x, y, w, h = box
#             merged = False
#             for i in range(len(merged_boxes)):
#                 mx, my, mw, mh = merged_boxes[i]
#                 if not (x > mx + mw + threshold or mx > x + w + threshold or
#                         y > my + mh + threshold or my > y + h + threshold):
#                     nx, ny = min(x, mx), min(y, my)
#                     nw, nh = max(x + w, mx + mw) - nx, max(y + h, my + mh) - ny
#                     merged_boxes[i] = (nx, ny, nw, nh)
#                     merged = True
#                     break
#             if not merged:
#                 merged_boxes.append(box)
#         return merged_boxes
    
#     merged_boxes = merge_close_boxes(bounding_boxes)
#     sorted_boxes = sorted(merged_boxes, key=lambda b: (b[1], b[0]))
#     extracted_images = []
    
#     for i, (x, y, w, h) in enumerate(sorted_boxes):
#         if w > 10 and h > 10:
#             char_image = binary_image[y:y + h, x:x + w]
    
#             temp_path = os.path.join(output_directory, f"temp_{i}.png")
#             cv2.imwrite(temp_path, 255 - char_image)
    
#             # Recognize character using Gemini
#             recognized_char = recognize_character_from_image(temp_path)
    
#             # Rename final output using recognized character
#             output_path = os.path.join(output_directory, f"{recognized_char}.png")
#             os.rename(temp_path, output_path)
    
#             print(f"Saved: {output_path}")
#             extracted_images.append(output_path)
    
#     return extracted_images
