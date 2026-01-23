
from PIL import Image

def analyze():
    img = Image.open("public/cognivectra-dark-match.png").convert("RGBA")
    pixels = img.load()
    w, h = img.size
    print(f"Corner (0,0): {pixels[0,0]}")
    print(f"Corner (max,max): {pixels[w-1, h-1]}")
    # Sample a few more
    print(f"Pixel (10,10): {pixels[10,10]}")

if __name__ == "__main__":
    analyze()
