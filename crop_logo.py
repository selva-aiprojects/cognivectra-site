
from PIL import Image

def smart_crop():
    try:
        input_path = "public/cognivectra-dark-match.png"
        output_path = "public/cognivectra-dark-crop.png"
        
        print(f"Opening {input_path}...")
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        # Use Top-Left pixel as reference background
        bg_r, bg_g, bg_b, _ = pixels[0, 0]
        print(f"Assuming background color is roughly: ({bg_r}, {bg_g}, {bg_b})")
        
        tolerance = 40 # Increased tolerance to ignore compression noise in background
        
        min_x, min_y = width, height
        max_x, max_y = 0, 0
        has_content = False
        
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                
                diff = abs(r - bg_r) + abs(g - bg_g) + abs(b - bg_b)
                
                if diff > tolerance:
                    if x < min_x: min_x = x
                    if x > max_x: max_x = x
                    if y < min_y: min_y = y
                    if y > max_y: max_y = y
                    has_content = True
        
        if has_content:
            pad = 10
            min_x = max(0, min_x - pad)
            min_y = max(0, min_y - pad)
            max_x = min(width, max_x + pad)
            max_y = min(height, max_y + pad)
            
            print(f"Cropping to ({min_x}, {min_y}) - ({max_x}, {max_y})")
            cropped_img = img.crop((min_x, min_y, max_x, max_y))
            cropped_img.save(output_path, "PNG")
            print(f"Saved cropped logo to {output_path}")
        else:
            print("No content found!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    smart_crop()
