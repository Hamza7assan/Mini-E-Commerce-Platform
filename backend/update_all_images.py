import os
import django
import urllib.request
from urllib.error import URLError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.catalog.models import Product, ProductVariant

def create_color_image_url(product_name, color_name):
    colors_hex = {
        "Navy": "0A192F",
        "Ceil": "7CA1B4",
        "Black": "111111",
        "Burgundy": "4A0E17",
        "Hunter Green": "1A3626",
        "Standard": "E2E8F0",
        "White": "F8FAFC",
        "Grey": "475569"
    }
    
    bg_color = colors_hex.get(color_name, "CCCCCC")
    text_color = "FFFFFF" if bg_color not in ["F8FAFC", "E2E8F0", "CCCCCC"] else "000000"
    
    # URL encode the text
    text = f"{product_name}\n{color_name}".replace(" ", "+").replace("\n", "%0A")
    
    return f"https://placehold.co/800x1000/{bg_color}/{text_color}.png?text={text}"

def main():
    print("Downloading and updating products and variants with unique images...")
    
    os.makedirs(os.path.join("media", "products"), exist_ok=True)
    os.makedirs(os.path.join("media", "variants"), exist_ok=True)

    products = Product.objects.all()
    for prod in products:
        print(f"Processing {prod.name}...")
        
        # 1. Update main product image
        prod_bg = "2C3E50"
        prod_text = prod.name.replace(" ", "+")
        prod_image_url = f"https://placehold.co/800x1000/{prod_bg}/FFFFFF.png?text={prod_text}"
        
        prod_filename = f"{prod.slug}_main.png"
        prod_filepath = os.path.join("media", "products", prod_filename)
        
        try:
            req = urllib.request.Request(prod_image_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(prod_filepath, 'wb') as out_file:
                out_file.write(response.read())
            prod.image = f"products/{prod_filename}"
            prod.save()
        except Exception as e:
            print(f"Failed to download main image for {prod.name}: {e}")
        
        # 2. Update all variants
        variants = prod.variants.all()
        
        # We only need one image per color per product
        downloaded_colors = set()
        
        for variant in variants:
            if variant.color in downloaded_colors:
                # Reuse the same image path for the same color of this product
                variant_filename = f"{prod.slug}_{variant.color.replace(' ', '_')}.png"
                variant.image = f"variants/{variant_filename}"
                variant.save()
                continue
                
            variant_url = create_color_image_url(prod.name, variant.color)
            variant_filename = f"{prod.slug}_{variant.color.replace(' ', '_')}.png"
            variant_filepath = os.path.join("media", "variants", variant_filename)
            
            try:
                req = urllib.request.Request(variant_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response, open(variant_filepath, 'wb') as out_file:
                    out_file.write(response.read())
                
                variant.image = f"variants/{variant_filename}"
                variant.save()
                downloaded_colors.add(variant.color)
            except Exception as e:
                print(f"Failed to download variant image for {variant.color}: {e}")
                
    print("Successfully updated all products and variants to have unique image URLs!")

if __name__ == "__main__":
    main()
