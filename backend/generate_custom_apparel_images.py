import os
import django
import math
from PIL import Image, ImageDraw, ImageFont

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.catalog.models import Category, Product, ProductVariant

# Color hex definitions for variants and brand
COLOR_MAP = {
    "Navy": "#0A192F",
    "Navy Blue": "#0A192F",
    "Ceil": "#527D8C",
    "Ceil Blue": "#527D8C",
    "Black": "#18181B",
    "Burgundy": "#680B1E",
    "Hunter Green": "#14452F",
    "Green": "#14452F",
    "White": "#F8FAFC",
    "Grey": "#475569",
    "Charcoal Grey": "#475569",
    "Standard": "#024B5C",
    "Brand": "#024B5C",
}

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 6:
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
    return (10, 25, 47)

def get_font(size, bold=False):
    font_names = ["calibrib.ttf" if bold else "calibri.ttf", "arialbd.ttf" if bold else "arial.ttf", "segoeuib.ttf" if bold else "segoeui.ttf"]
    for fname in font_names:
        try:
            return ImageFont.truetype(fname, size)
        except Exception:
            continue
    return ImageFont.load_default()

def draw_shadow(draw, box, radius=20, fill=(0, 0, 0, 25)):
    x0, y0, x1, y1 = box
    for i in range(10, 0, -2):
        alpha = int(fill[3] * (i / 10))
        draw.rounded_rectangle([x0-i, y0-i, x1+i, y1+i], radius=radius+i, fill=(fill[0], fill[1], fill[2], alpha))

def draw_scrub_top(draw, cx, cy, w, h, color_rgb):
    # Main shirt torso
    top_y = cy - h//2
    bot_y = cy + h//2
    left_x = cx - w//2
    right_x = cx + w//2
    
    # Darker outline / shading color
    dark = tuple(max(0, int(c * 0.75)) for c in color_rgb)
    light = tuple(min(255, int(c * 1.2 + 30)) for c in color_rgb)
    outline = (30, 41, 59) if color_rgb != (248, 250, 252) else (148, 163, 184)
    
    # Sleeves
    sleeve_w = int(w * 0.35)
    sleeve_h = int(h * 0.45)
    # Left sleeve
    draw.polygon([
        (left_x + 20, top_y + 10),
        (left_x - sleeve_w, top_y + sleeve_h * 0.4),
        (left_x - sleeve_w + 20, top_y + sleeve_h),
        (left_x + 10, top_y + sleeve_h * 0.8)
    ], fill=dark, outline=outline, width=3)
    # Right sleeve
    draw.polygon([
        (right_x - 20, top_y + 10),
        (right_x + sleeve_w, top_y + sleeve_h * 0.4),
        (right_x + sleeve_w - 20, top_y + sleeve_h),
        (right_x - 10, top_y + sleeve_h * 0.8)
    ], fill=dark, outline=outline, width=3)
    
    # Torso body
    draw.rounded_rectangle([left_x, top_y + 15, right_x, bot_y], radius=24, fill=color_rgb, outline=outline, width=4)
    
    # V-Neck collar
    neck_w = int(w * 0.38)
    neck_depth = int(h * 0.32)
    draw.polygon([
        (cx - neck_w//2, top_y + 15),
        (cx + neck_w//2, top_y + 15),
        (cx, top_y + 15 + neck_depth)
    ], fill=(241, 245, 249), outline=outline, width=3)
    
    # Inner V-Neck trim band
    draw.line([(cx - neck_w//2, top_y + 15), (cx, top_y + 15 + neck_depth)], fill=dark, width=6)
    draw.line([(cx + neck_w//2, top_y + 15), (cx, top_y + 15 + neck_depth)], fill=dark, width=6)
    
    # Chest pocket (left side of shirt = right side of drawing)
    pw, ph = int(w * 0.28), int(h * 0.26)
    px, py = cx + int(w * 0.1), cy - int(h * 0.05)
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=8, fill=color_rgb, outline=outline, width=2)
    # Pocket pen slot line
    draw.line([(px + int(pw * 0.3), py), (px + int(pw * 0.3), py + ph)], fill=outline, width=2)
    
    # ID Badge clipped to pocket
    draw.rounded_rectangle([px + 10, py - 15, px + 35, py + 5], radius=3, fill=(226, 232, 240), outline=(100, 116, 139), width=2)
    draw.rectangle([px + 15, py - 10, px + 30, py - 2], fill=(2, 75, 92))

def draw_scrub_pants(draw, cx, cy, w, h, color_rgb):
    top_y = cy - h//2
    bot_y = cy + h//2
    left_x = cx - w//2
    right_x = cx + w//2
    
    dark = tuple(max(0, int(c * 0.75)) for c in color_rgb)
    outline = (30, 41, 59) if color_rgb != (248, 250, 252) else (148, 163, 184)
    
    # Left leg
    leg_w = int(w * 0.44)
    draw.rounded_rectangle([left_x, top_y + 40, left_x + leg_w, bot_y], radius=16, fill=color_rgb, outline=outline, width=4)
    # Right leg
    draw.rounded_rectangle([right_x - leg_w, top_y + 40, right_x, bot_y], radius=16, fill=color_rgb, outline=outline, width=4)
    
    # Waistband
    draw.rounded_rectangle([left_x - 6, top_y, right_x + 6, top_y + 45], radius=12, fill=dark, outline=outline, width=4)
    # Drawstring strings
    draw.arc([cx - 25, top_y + 20, cx, top_y + 70], start=0, end=180, fill=(241, 245, 249), width=4)
    draw.arc([cx, top_y + 20, cx + 25, top_y + 70], start=0, end=180, fill=(241, 245, 249), width=4)
    draw.line([(cx - 25, top_y + 45), (cx - 25, top_y + 85)], fill=(241, 245, 249), width=4)
    draw.line([(cx + 25, top_y + 45), (cx + 25, top_y + 85)], fill=(241, 245, 249), width=4)
    
    # Cargo side pocket on right leg
    pw, ph = int(leg_w * 0.7), int(h * 0.25)
    px, py = right_x - leg_w + int(leg_w * 0.15), cy - int(h * 0.05)
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=8, fill=color_rgb, outline=outline, width=3)
    draw.line([(px, py + 12), (px + pw, py + 12)], fill=outline, width=2)

def draw_lab_coat(draw, cx, cy, w, h, color_rgb):
    top_y = cy - h//2
    bot_y = cy + h//2
    left_x = cx - w//2
    right_x = cx + w//2
    outline = (100, 116, 139)
    coat_color = (255, 255, 255)
    
    # Sleeves
    sleeve_w = int(w * 0.3)
    sleeve_h = int(h * 0.75)
    draw.rounded_rectangle([left_x - sleeve_w + 20, top_y + 20, left_x + 30, top_y + sleeve_h], radius=16, fill=coat_color, outline=outline, width=3)
    draw.rounded_rectangle([right_x - 30, top_y + 20, right_x + sleeve_w - 20, top_y + sleeve_h], radius=16, fill=coat_color, outline=outline, width=3)
    
    # Inner scrub shirt visible at chest
    draw.rounded_rectangle([left_x + 20, top_y + 10, right_x - 20, top_y + 150], radius=10, fill=(2, 75, 92), outline=outline, width=2)
    
    # Main coat body
    draw.rounded_rectangle([left_x, top_y + 15, right_x, bot_y], radius=20, fill=coat_color, outline=outline, width=4)
    
    # Lapels / Collar opening (V-shape opening showing inner shirt)
    draw.polygon([
        (cx - int(w * 0.35), top_y + 15),
        (cx + int(w * 0.35), top_y + 15),
        (cx, top_y + 180)
    ], fill=(2, 75, 92), outline=outline, width=3)
    
    # Left & Right folded collar lapels
    draw.polygon([(cx - int(w * 0.35), top_y + 15), (cx, top_y + 180), (cx - int(w * 0.15), top_y + 15)], fill=(248, 250, 252), outline=outline, width=3)
    draw.polygon([(cx + int(w * 0.35), top_y + 15), (cx, top_y + 180), (cx + int(w * 0.15), top_y + 15)], fill=(248, 250, 252), outline=outline, width=3)
    
    # Center opening line down to bottom
    draw.line([(cx, top_y + 180), (cx, bot_y)], fill=outline, width=3)
    
    # Buttons
    for by in range(top_y + 230, bot_y - 40, 60):
        draw.ellipse([cx + 12 - 6, by - 6, cx + 12 + 6, by + 6], fill=(71, 85, 105), outline=(30, 41, 59), width=2)
        
    # Lower patch pockets
    pw, ph = int(w * 0.32), int(h * 0.22)
    draw.rounded_rectangle([left_x + 20, bot_y - ph - 30, left_x + 20 + pw, bot_y - 30], radius=8, fill=coat_color, outline=outline, width=3)
    draw.rounded_rectangle([right_x - 20 - pw, bot_y - ph - 30, right_x - 20, bot_y - 30], radius=8, fill=coat_color, outline=outline, width=3)

def draw_shoes(draw, cx, cy, w, h, color_rgb):
    outline = (30, 41, 59) if color_rgb != (248, 250, 252) else (148, 163, 184)
    dark = tuple(max(0, int(c * 0.7)) for c in color_rgb)
    
    # Draw two clogs/sneakers side by side / slightly offset
    for offset_x, offset_y, flip in [(-60, -25, False), (60, 25, True)]:
        x = cx + offset_x
        y = cy + offset_y
        sw, sh = int(w * 0.65), int(h * 0.45)
        
        # Shoe sole (thick rubber bottom)
        draw.rounded_rectangle([x - sw//2, y + sh//4, x + sw//2, y + sh//2], radius=14, fill=(241, 245, 249), outline=(100, 116, 139), width=3)
        # Tread notches
        for tx in range(x - sw//2 + 15, x + sw//2 - 10, 20):
            draw.line([(tx, y + sh//2), (tx, y + sh//2 - 8)], fill=(100, 116, 139), width=3)
            
        # Upper shoe body
        draw.rounded_rectangle([x - sw//2 + 5, y - sh//2, x + sw//2 - 10, y + sh//4 + 5], radius=24, fill=color_rgb, outline=outline, width=4)
        
        # Heel strap / collar
        draw.arc([x - sw//2 + 10, y - sh//4, x + sw//4, y + sh//4], start=180, end=360, fill=dark, width=8)
        
        # Ventilation holes
        for hx in range(x - int(sw*0.2), x + int(sw*0.3), 22):
            draw.ellipse([hx - 4, y - 5 - 4, hx + 4, y - 5 + 4], fill=dark)

def draw_accessories_item(draw, cx, cy, w, h, slug, color_rgb):
    outline = (30, 41, 59)
    
    if "stethoscope" in slug or "accessories" in slug:
        # Stethoscope
        draw.arc([cx - w//3, cy - h//3, cx + w//3, cy + h//3], start=0, end=180, fill=(30, 41, 59), width=16)
        draw.arc([cx - w//3, cy - h//3, cx + w//3, cy + h//3], start=0, end=180, fill=color_rgb, width=10)
        # Y-tube branching up
        draw.line([(cx - w//3 + 10, cy - h//6), (cx - w//4, cy - h//2)], fill=(148, 163, 184), width=8)
        draw.line([(cx + w//3 - 10, cy - h//6), (cx + w//4, cy - h//2)], fill=(148, 163, 184), width=8)
        # Earpieces
        draw.ellipse([cx - w//4 - 10, cy - h//2 - 10, cx - w//4 + 10, cy - h//2 + 10], fill=(15, 23, 42))
        draw.ellipse([cx + w//4 - 10, cy - h//2 - 10, cx + w//4 + 10, cy - h//2 + 10], fill=(15, 23, 42))
        # Chestpiece disc at bottom center
        draw.ellipse([cx - 35, cy + h//3 - 35, cx + 35, cy + h//3 + 35], fill=(203, 213, 225), outline=(51, 65, 85), width=5)
        draw.ellipse([cx - 20, cy + h//3 - 20, cx + 20, cy + h//3 + 20], fill=(2, 75, 92))
        
    elif "sock" in slug:
        # Compression socks pair
        for ox in [-45, 45]:
            x = cx + ox
            draw.rounded_rectangle([x - 30, cy - h//2 + 20, x + 30, cy + h//4], radius=12, fill=color_rgb, outline=outline, width=3)
            # Foot footbed extending out
            draw.rounded_rectangle([x - 30, cy + h//4 - 20, x + 55, cy + h//2 - 10], radius=16, fill=color_rgb, outline=outline, width=3)
            # Ribbed cuff top
            draw.rectangle([x - 32, cy - h//2 + 20, x + 32, cy - h//2 + 55], fill=(2, 75, 92), outline=outline, width=2)
            # Heel & Toe accents
            draw.ellipse([x - 32, cy + h//4 - 15, x - 5, cy + h//4 + 15], fill=(203, 213, 225))
            draw.arc([x + 30, cy + h//4 - 15, x + 55, cy + h//2 - 10], start=270, end=90, fill=(2, 75, 92), width=8)
            
    elif "badge" in slug:
        # Badge reel & ID Card
        # Carabiner clip at top
        draw.rounded_rectangle([cx - 25, cy - h//2 + 20, cx + 25, cy - h//2 + 70], radius=12, fill=(203, 213, 225), outline=outline, width=4)
        # Round reel disc
        draw.ellipse([cx - 60, cy - h//2 + 50, cx + 60, cy - h//2 + 170], fill=color_rgb, outline=outline, width=5)
        draw.ellipse([cx - 35, cy - h//2 + 75, cx + 35, cy - h//2 + 145], fill=(255, 255, 255), outline=outline, width=2)
        # Strap / Cord
        draw.line([(cx, cy - h//2 + 170), (cx, cy + 10)], fill=outline, width=4)
        # ID Card Holder
        draw.rounded_rectangle([cx - 90, cy + 10, cx + 90, cy + h//2 - 20], radius=10, fill=(248, 250, 252), outline=(100, 116, 139), width=3)
        # Photo silhouette on card
        draw.rectangle([cx - 75, cy + 30, cx - 15, cy + 110], fill=(203, 213, 225))
        draw.ellipse([cx - 60, cy + 40, cx - 30, cy + 70], fill=(100, 116, 139))
        draw.arc([cx - 70, cy + 75, cx - 20, cy + 125], start=180, end=360, fill=(100, 116, 139), width=15)
        # Text lines on card
        draw.line([(cx + 5, cy + 45), (cx + 75, cy + 45)], fill=(2, 75, 92), width=8)
        draw.line([(cx + 5, cy + 70), (cx + 55, cy + 70)], fill=(148, 163, 184), width=6)
        draw.line([(cx + 5, cy + 90), (cx + 65, cy + 90)], fill=(148, 163, 184), width=6)
        
    elif "cap" in slug:
        # Surgical Cap
        # Main dome
        draw.arc([cx - w//2, cy - h//3, cx + w//2, cy + h//3], start=180, end=360, fill=color_rgb, width=150)
        draw.chord([cx - w//2, cy - h//3, cx + w//2, cy + h//3], start=180, end=360, fill=color_rgb, outline=outline, width=4)
        # Bottom headband rim
        draw.rounded_rectangle([cx - w//2 - 10, cy + h//6 - 20, cx + w//2 + 10, cy + h//6 + 20], radius=10, fill=(2, 75, 92), outline=outline, width=3)
        # Tie straps waving out back
        draw.arc([cx + w//3, cy + h//6, cx + w//2 + 60, cy + h//2], start=0, end=120, fill=color_rgb, width=14)
        draw.arc([cx + w//3 - 20, cy + h//6 + 10, cx + w//2 + 40, cy + h//2 + 20], start=0, end=120, fill=color_rgb, width=14)
    else:
        # Generic accessories / steth
        draw_accessories_item(draw, cx, cy, w, h, "stethoscope", color_rgb)

def generate_image_card(filename, title, subtitle, item_type, color_name="Standard", is_category=False):
    W, H = 800, 1000
    img = Image.new("RGB", (W, H), (248, 250, 252))
    draw = ImageDraw.Draw(img, "RGBA")
    
    # 1. Background decorative card frame & gradient feel
    draw.rounded_rectangle([30, 30, W - 30, H - 30], radius=32, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    
    # Color circle / podium background behind item
    color_rgb = hex_to_rgb(COLOR_MAP.get(color_name, "#024B5C"))
    bg_circle_color = (color_rgb[0], color_rgb[1], color_rgb[2], 22)
    draw.ellipse([W//2 - 240, 360 - 240, W//2 + 240, 360 + 240], fill=bg_circle_color)
    
    # 2. Draw the item illustration in center
    cx, cy = W // 2, 380
    iw, ih = 340, 380
    
    if item_type == "scrub_top":
        draw_scrub_top(draw, cx, cy, iw, ih, color_rgb)
    elif item_type == "scrub_pants":
        draw_scrub_pants(draw, cx, cy, iw, ih, color_rgb)
    elif item_type == "lab_coat":
        draw_lab_coat(draw, cx, cy, iw, ih, color_rgb)
    elif item_type == "shoes":
        draw_shoes(draw, cx, cy, iw, ih, color_rgb)
    elif item_type in ["socks", "stethoscope", "badge", "cap", "accessories"]:
        draw_accessories_item(draw, cx, cy, iw, ih, item_type, color_rgb)
    elif item_type == "outfit":
        # Draw top and pants together
        draw_scrub_top(draw, cx, cy - 90, int(iw*0.85), int(ih*0.65), color_rgb)
        draw_scrub_pants(draw, cx, cy + 120, int(iw*0.75), int(ih*0.65), color_rgb)
    else:
        draw_scrub_top(draw, cx, cy, iw, ih, color_rgb)

    # 3. Typography / Labels at bottom
    # Bottom card badge area
    badge_top = 700
    draw.line([(80, badge_top), (W - 80, badge_top)], fill=(241, 245, 249), width=2)
    
    font_title = get_font(42, bold=True)
    font_sub = get_font(22, bold=True)
    font_brand = get_font(18, bold=True)
    
    # Brand tag at top left
    draw.text((60, 55), "RM MEDWEAR", fill=(2, 75, 92), font=font_brand)
    draw.text((W - 140, 55), "PREMIUM", fill=(148, 163, 184), font=font_brand)
    
    # Title (wrap if too long)
    title_upper = title.upper()
    bbox = font_title.getbbox(title_upper)
    tw = bbox[2] - bbox[0]
    if tw > W - 120:
        font_title = get_font(34, bold=True)
        bbox = font_title.getbbox(title_upper)
        tw = bbox[2] - bbox[0]
    draw.text((W//2 - tw//2, badge_top + 45), title_upper, fill=(15, 23, 42), font=font_title)
    
    # Subtitle pill (color / category name)
    sub_text = subtitle.upper() if subtitle else color_name.upper()
    s_bbox = font_sub.getbbox(sub_text)
    sw = s_bbox[2] - s_bbox[0]
    pill_x0 = W//2 - sw//2 - 24
    pill_y0 = badge_top + 130
    pill_x1 = W//2 + sw//2 + 24
    pill_y1 = pill_y0 + 44
    
    pill_fill = color_rgb if color_rgb != (248, 250, 252) else (2, 75, 92)
    pill_text_color = (255, 255, 255) if pill_fill != (248, 250, 252) else (15, 23, 42)
    
    draw.rounded_rectangle([pill_x0, pill_y0, pill_x1, pill_y1], radius=22, fill=pill_fill)
    draw.text((W//2 - sw//2, pill_y0 + 10), sub_text, fill=pill_text_color, font=font_sub)
    
    # 4. Save Image
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    img.save(filename, "PNG", quality=95)
    return filename

def main():
    print("Starting generation of custom illustrated medical apparel images...")
    
    media_cats = os.path.join("media", "categories")
    media_prods = os.path.join("media", "products")
    media_vars = os.path.join("media", "variants")
    
    os.makedirs(media_cats, exist_ok=True)
    os.makedirs(media_prods, exist_ok=True)
    os.makedirs(media_vars, exist_ok=True)

    # 1. Categories
    cats = Category.objects.all()
    for cat in cats:
        filename = os.path.join(media_cats, f"cat_{cat.slug}.png")
        item_type = "outfit"
        color = "Ceil"
        if "men" in cat.slug:
            color = "Navy"
        elif "lab" in cat.slug:
            item_type = "lab_coat"
            color = "White"
        elif "footwear" in cat.slug:
            item_type = "shoes"
            color = "Standard"
        elif "accessories" in cat.slug:
            item_type = "stethoscope"
            color = "Standard"
            
        generate_image_card(filename, cat.name, "COLLECTION • RM MEDWEAR", item_type, color, is_category=True)
        cat.image = f"categories/cat_{cat.slug}.png"
        cat.save()
        print(f"Generated category image: {cat.name}")

    # 2. Products & Variants
    products = Product.objects.all()
    for prod in products:
        # Determine item type
        item_type = "scrub_top"
        slug_lower = prod.slug.lower()
        if any(k in slug_lower for k in ["pant", "jogger", "trouser"]):
            item_type = "scrub_pants"
        elif any(k in slug_lower for k in ["coat", "jacket"]):
            item_type = "lab_coat"
        elif any(k in slug_lower for k in ["shoe", "clog", "footwear"]):
            item_type = "shoes"
        elif "sock" in slug_lower:
            item_type = "socks"
        elif "steth" in slug_lower:
            item_type = "stethoscope"
        elif "badge" in slug_lower:
            item_type = "badge"
        elif "cap" in slug_lower:
            item_type = "cap"

        # Main product image
        main_filename = os.path.join(media_prods, f"{prod.slug}_main.png")
        default_color = "Ceil" if "women" in slug_lower else ("Navy" if "men" in slug_lower else "Standard")
        if item_type == "lab_coat":
            default_color = "White"
        
        generate_image_card(main_filename, prod.name, f"{prod.category.name.upper()}", item_type, default_color)
        prod.image = f"products/{prod.slug}_main.png"
        prod.save()
        print(f"Generated product main image: {prod.name}")

        # Variants
        variants = prod.variants.all()
        for var in variants:
            var_filename = os.path.join(media_vars, f"{prod.slug}_{var.color.replace(' ', '_')}.png")
            if not os.path.exists(var_filename):
                generate_image_card(var_filename, prod.name, f"COLOR: {var.color.upper()}", item_type, var.color)
            var.image = f"variants/{prod.slug}_{var.color.replace(' ', '_')}.png"
            var.save()
        print(f"Updated {len(variants)} variants for {prod.name}")

    print("All custom apparel images generated and database updated successfully!")

if __name__ == "__main__":
    main()
