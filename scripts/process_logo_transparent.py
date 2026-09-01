"""
Process FIXCARE LOGO.jpg into a transparent-background PNG suitable for
particle-logo rendering on a canvas.

Removes the white/near-white background and keeps the dark foreground pixels
with smooth alpha edges (anti-aliased) so the particles trace the logo cleanly
on any background color.
"""
import os
from PIL import Image, ImageFilter

SRC = "/home/z/my-project/upload/FIXCARE LOGO.jpg"
DST = "/home/z/my-project/public/fixcare-logo-particles.png"

# Load the JPEG and convert to RGBA
src = Image.open(SRC).convert("RGB")
w, h = src.size
print(f"Source: {w}x{h}")

# Create an alpha channel based on how "dark" each pixel is.
# Dark pixels (the logo content) get full alpha (255).
# White pixels (the background) get zero alpha (transparent).
# Pixels in between get a smooth transition for anti-aliasing.

# Load pixels into a list for fast access
pixels = src.load()
alpha_img = Image.new("L", (w, h), 0)  # start with all transparent
alpha_pixels = alpha_img.load()

# Threshold: any pixel whose brightness is below 200 is considered foreground.
# Brightness = max(r,g,b) since the foreground is near-black and bg is near-white.
# We use a smooth transition between 200 and 220 for anti-aliasing.
for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        brightness = max(r, g, b)
        if brightness < 180:
            # Pure foreground — full alpha
            alpha_pixels[x, y] = 255
        elif brightness > 230:
            # Pure background — transparent
            alpha_pixels[x, y] = 0
        else:
            # Smooth transition for anti-aliasing
            # 180 → 255, 230 → 0
            t = (230 - brightness) / (230 - 180)
            alpha_pixels[x, y] = int(t * 255)

# Apply a tiny blur to soften the alpha edge for nicer particle distribution
alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.8))

# Convert foreground color to brand teal (#0E7C66) for particles
# Or keep original dark gray? Original looks more "logo-like"
# Let's keep the original near-black color (#404348) so it matches the brand
# Dark gray reads as sophisticated + neutral on any bg

# Create RGBA image: dark gray foreground + alpha channel
dst = Image.new("RGBA", (w, h), (0, 0, 0, 0))
dst_pixels = dst.load()
for y in range(h):
    for x in range(w):
        a = alpha_pixels[x, y]
        if a > 0:
            # Original foreground color (#404348) — keeps the brand look
            dst_pixels[x, y] = (64, 67, 72, a)

# Crop to the foreground bbox to remove empty margins (saves bytes + centers the logo)
# But keep a small margin around it for breathing room
bbox = alpha_img.getbbox()
if bbox:
    # Add 16px margin
    margin = 16
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(w, bbox[2] + margin)
    bottom = min(h, bbox[3] + margin)
    dst = dst.crop((left, top, right, bottom))
    print(f"Cropped to: {dst.size}")

# Save optimized PNG
dst.save(DST, "PNG", optimize=True)
size_kb = os.path.getsize(DST) / 1024
print(f"Saved: {DST}")
print(f"Size: {dst.size}, {size_kb:.1f} KB")
