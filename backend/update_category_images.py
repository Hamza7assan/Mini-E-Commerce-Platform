import os
import shutil
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.catalog.models import Category

def update_category_images():
    brain_dir = r"C:\Users\DELL\.gemini\antigravity\brain\c2c334fc-74f2-4c56-81fd-26e6bef0ece9"
    media_categories_dir = os.path.join("media", "categories")
    os.makedirs(media_categories_dir, exist_ok=True)

    # Define slug to file mapping
    slug_files = {
        "womens-scrubs": "cat_womens_scrubs_1784048816151.png",
        "mens-scrubs": "cat_mens_scrubs_1784048826362.png",
        "accessories": "cat_accessories_1784048834979.png",
        "lab-coats": "cat_lab_coats_1784048842766.png",
        "footwear": "cat_footwear_1784048851315.png"
    }

    print("Copying images and updating categories...")

    categories = Category.objects.all()
    count = 0
    for cat in categories:
        if cat.slug in slug_files:
            filename = slug_files[cat.slug]
            src = os.path.join(brain_dir, filename)
            dst = os.path.join(media_categories_dir, filename)
            
            if os.path.exists(src):
                shutil.copy2(src, dst)
                cat.image = f"categories/{filename}"
                cat.save()
                count += 1
                print(f"Updated {cat.name} with {filename}")
            else:
                print(f"File not found: {src}")
                
    print(f"Updated {count} categories successfully.")

if __name__ == '__main__':
    update_category_images()
