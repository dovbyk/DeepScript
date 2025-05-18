import cv2
import os
import numpy as np

def process_uploaded_image(input_image_path):
    output_directory = "processed_characters"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    
    image = cv2.imread(input_image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary_image = cv2.threshold(gray_image, 127, 255, cv2.THRESH_BINARY_INV)
    
    kernel = np.ones((3, 3), np.uint8)
    binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, kernel)
    binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_CLOSE, kernel)
    
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    
    def merge_close_boxes(boxes, threshold=20):
        merged_boxes = []
        for box in boxes:
            x, y, w, h = box
            merged = False
            for i in range(len(merged_boxes)):
                mx, my, mw, mh = merged_boxes[i]
                if not (x > mx + mw + threshold or mx > x + w + threshold or
                        y > my + mh + threshold or my > y + h + threshold):
                    nx, ny = min(x, mx), min(y, my)
                    nw, nh = max(x + w, mx + mw) - nx, max(y + h, my + mh) - ny
                    merged_boxes[i] = (nx, ny, nw, nh)
                    merged = True
                    break
            if not merged:
                merged_boxes.append(box)
        return merged_boxes
    
    merged_boxes = merge_close_boxes(bounding_boxes)
    sorted_boxes = sorted(merged_boxes, key=lambda b: (b[1], b[0]))
    extracted_images = []
    
    for i, (x, y, w, h) in enumerate(sorted_boxes):
    # Filter out noise by setting a size threshold
        if w > 10 and h > 10:
            # Extract the character from the binary image
            char_image = binary_image[y:y + h, x:x + w]

            # Save the character as an individual image
            output_path = os.path.join(output_directory, f"character_{i}.png")
            cv2.imwrite(output_path, 255 - char_image )  # Convert back to uint8
            print(f"Saved: {output_path}")
            extracted_images.append(output_path)
    
    return extracted_images
