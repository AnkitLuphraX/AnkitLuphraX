from PIL import Image
import os

# Paths
src_path = r"C:/Users/ankit/.gemini/antigravity-ide/brain/dfee142f-581a-49ec-a0d9-ffed6ab87a30/upgraded_banner_1779981386963.png"
dest_path = r"header.png"

if not os.path.exists(src_path):
    print(f"Error: Source image not found at {src_path}")
    exit(1)

# Open, crop and save
print(f"Opening generated banner image from {src_path}...")
img = Image.open(src_path)
width, height = img.size

# Let's crop a beautiful 1024x340 banner centered vertically
crop_height = 340
top = (height - crop_height) // 2
bottom = top + crop_height

print("Cropping image to 1024x340 (3:1 wide aspect ratio)...")
cropped_img = img.crop((0, top, width, bottom))

print("Saving optimized banner to header.png...")
cropped_img.save(dest_path, format="PNG", optimize=True)

print("Successfully cropped and optimized banner!")
