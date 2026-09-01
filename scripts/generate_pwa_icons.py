"""
Generate PWA icons for FixCare Service Center.
Creates: icon-192.png, icon-512.png, apple-touch-icon.png (180), favicon-32.png, favicon-16.png
Design: navy rounded-square background + teal "F" with a wrench accent.
"""
import os
from PIL import Image, ImageDraw, ImageFont
import math

OUTPUT_DIR = "/home/z/my-project/public/icons"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Brand colors
NAVY = (15, 37, 64)        # #0F2540 - primary
TEAL = (14, 124, 102)      # #0E7C66 - accent
WHITE = (255, 255, 255)
LIGHT_TEAL = (45, 168, 144)


def draw_fixcare_icon(size: int, maskable: bool = False) -> Image.Image:
    """Draw the FixCare icon at the given size."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # For maskable icons, leave a safe zone (10% padding) per Google PWA guidance
    if maskable:
        bg_padding = int(size * 0.10)
        bg_radius = int(size * 0.18)  # rounded-square background
    else:
        bg_padding = 0
        bg_radius = int(size * 0.20)

    # 1. Background: navy rounded square
    draw.rounded_rectangle(
        [bg_padding, bg_padding, size - bg_padding, size - bg_padding],
        radius=bg_radius,
        fill=NAVY,
    )

    # 2. Decorative top accent bar (thin teal stripe across top of inner area)
    accent_y = int(size * 0.18)
    accent_height = max(2, int(size * 0.025))
    accent_x_start = int(size * 0.22)
    accent_x_end = int(size * 0.78)
    if not maskable:
        draw.rectangle(
            [accent_x_start, accent_y, accent_x_end, accent_y + accent_height],
            fill=TEAL,
        )

    # 3. Draw the letter "F" - bold, centered
    # Build an "F" shape using rectangles for crisp pixel-perfect rendering at any size
    f_left = int(size * 0.32)
    f_right = int(size * 0.68)
    f_top = int(size * 0.32)
    f_bottom = int(size * 0.78)
    f_thickness = max(4, int(size * 0.10))

    if maskable:
        # Shift F down slightly to avoid the safe-zone cut
        f_top = int(size * 0.36)
        f_bottom = int(size * 0.74)

    # Vertical bar of F
    draw.rectangle(
        [f_left, f_top, f_left + f_thickness, f_bottom],
        fill=WHITE,
    )
    # Top horizontal bar of F
    top_bar_height = max(3, int(size * 0.085))
    draw.rectangle(
        [f_left, f_top, f_right, f_top + top_bar_height],
        fill=WHITE,
    )
    # Middle horizontal bar of F (shorter)
    mid_y = int(size * 0.52)
    mid_bar_height = max(3, int(size * 0.07))
    mid_bar_end = int(size * 0.62)
    draw.rectangle(
        [f_left, mid_y, mid_bar_end, mid_y + mid_bar_height],
        fill=WHITE,
    )

    # 4. Wrench accent: small diagonal teal accent at the bottom-right of the F
    # Draw a small circle (wrench head) + thin diagonal line (handle)
    wrench_radius = max(2, int(size * 0.06))
    wrench_center = (int(size * 0.74), int(size * 0.72))
    if not maskable:
        draw.ellipse(
            [
                wrench_center[0] - wrench_radius,
                wrench_center[1] - wrench_radius,
                wrench_center[0] + wrench_radius,
                wrench_center[1] + wrench_radius,
            ],
            fill=TEAL,
        )

    return img


def save_png(img: Image.Image, path: str, size: int) -> None:
    """Resize and save image as PNG."""
    resized = img.resize((size, size), Image.LANCZOS)
    resized.save(path, "PNG", optimize=True)
    print(f"✓ {path} ({size}x{size}, {os.path.getsize(path)//1024} KB)")


def save_ico(img: Image.Image, path: str) -> None:
    """Save multi-resolution .ico favicon."""
    sizes = [16, 32, 48, 64]
    images = [img.resize((s, s), Image.LANCZOS) for s in sizes]
    images[0].save(path, format="ICO", sizes=[(s, s) for s in sizes], append_images=images[1:])
    print(f"✓ {path} ({os.path.getsize(path)//1024} KB)")


def main():
    # Generate base high-res icon (1024x1024 for crisp downscaling)
    print("Generating FixCare PWA icons...")
    print(f"Output dir: {OUTPUT_DIR}")
    print()

    base = draw_fixcare_icon(1024, maskable=False)
    base_maskable = draw_fixcare_icon(1024, maskable=True)

    # Standard PWA icons
    save_png(base, f"{OUTPUT_DIR}/icon-192.png", 192)
    save_png(base, f"{OUTPUT_DIR}/icon-512.png", 512)

    # Maskable icon (with safe zone for Android adaptive icons)
    save_png(base_maskable, f"{OUTPUT_DIR}/icon-192-maskable.png", 192)
    save_png(base_maskable, f"{OUTPUT_DIR}/icon-512-maskable.png", 512)

    # Apple Touch Icon (180x180, must be solid bg, no transparency)
    apple = draw_fixcare_icon(180, maskable=False)
    # Apple touch icon should be opaque
    apple_opaque = Image.new("RGB", (180, 180), NAVY)
    apple_opaque.paste(apple, (0, 0), apple)
    apple_opaque.save(f"{OUTPUT_DIR}/apple-touch-icon.png", "PNG", optimize=True)
    print(f"✓ {OUTPUT_DIR}/apple-touch-icon.png (180x180, {os.path.getsize(f'{OUTPUT_DIR}/apple-touch-icon.png')//1024} KB)")

    # Favicon ICO (multi-resolution)
    save_ico(base, f"{OUTPUT_DIR}/favicon.ico")

    # Favicon PNGs (32x32 and 16x16)
    save_png(base, f"{OUTPUT_DIR}/favicon-32.png", 32)
    save_png(base, f"{OUTPUT_DIR}/favicon-16.png", 16)

    # OpenGraph image (1200x630 for social sharing)
    og = Image.new("RGB", (1200, 630), NAVY)
    og_draw = ImageDraw.Draw(og)
    # Center the FixCare icon (scaled to 360px) on the left
    icon_360 = base.resize((360, 360), Image.LANCZOS)
    og.paste(icon_360, (80, 135), icon_360)
    # Title text on the right
    try:
        title_font = ImageFont.truetype(
            "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf", 64
        )
        sub_font = ImageFont.truetype(
            "/usr/share/fonts/truetype/freefont/FreeSerif.ttf", 32
        )
        og_draw.text((500, 220), "FixCare Service Center", fill=WHITE, font=title_font)
        og_draw.text((500, 300), "Same-Day Appliance Repair in Jammu", fill=LIGHT_TEAL, font=sub_font)
        og_draw.text((500, 350), "Call +91-70515-87802 · 24/7", fill=WHITE, font=sub_font)
    except Exception as e:
        print(f"Font fallback: {e}")
        og_draw.text((500, 220), "FixCare Service Center", fill=WHITE)
        og_draw.text((500, 300), "Same-Day Appliance Repair in Jammu", fill=LIGHT_TEAL)
        og_draw.text((500, 350), "Call +91-70515-87802 · 24/7", fill=WHITE)

    # Top accent bar
    og_draw.rectangle([0, 0, 1200, 8], fill=TEAL)
    og.save(f"{OUTPUT_DIR}/og-image.png", "PNG", optimize=True)
    print(f"✓ {OUTPUT_DIR}/og-image.png (1200x630, {os.path.getsize(f'{OUTPUT_DIR}/og-image.png')//1024} KB)")

    print()
    print("All icons generated successfully.")
    print(f"Files in {OUTPUT_DIR}:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        print(f"  {f}")


if __name__ == "__main__":
    main()
