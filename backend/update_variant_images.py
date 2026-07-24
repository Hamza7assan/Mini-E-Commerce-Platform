import os
import shutil
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.catalog.models import ProductVariant

def update_variant_images():
    brain_dir = r"C:\Users\DELL\.gemini\antigravity\brain\c2c334fc-74f2-4c56-81fd-26e6bef0ece9"
    media_variants_dir = os.path.join("media", "variants")
    os.makedirs(media_variants_dir, exist_ok=True)

    # Define color to file mapping
    color_files = {
        "Navy Blue": "navy_scrubs_1784048390531.png",
        "Black": "black_scrubs_1784048460805.png",
        "Charcoal Grey": "grey_scrubs_1784048470459.png",
        "Hunter Green": "green_scrubs_1784048477781.png"
    }

    print("Copying images and updating database...")

    # Copy files to media/variants
    for color, filename in color_files.items():
        src = os.path.join(brain_dir, filename)
        dst = os.path.join(media_variants_dir, filename)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {filename}")
        else:
            print(f"File not found: {src}")

    # Update variants in the database
    variants = ProductVariant.objects.all()
    count = 0
    for variant in variants:
        if variant.color in color_files:
            variant.image = f"variants/{color_files[variant.color]}"
            variant.save()
            count += 1
            
    print(f"Updated {count} variants successfully.")

if __name__ == '__main__':
    update_variant_images()
