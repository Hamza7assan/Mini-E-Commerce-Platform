import os
import django
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.catalog.models import Category, Product, ProductVariant

def populate():
    # Clear existing data just in case
    ProductVariant.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()

    # 1. Create Categories
    women_cat, _ = Category.objects.get_or_create(slug="womens-scrubs", defaults={"name": "Women's Scrubs", "image": "categories/women.png"})
    men_cat, _ = Category.objects.get_or_create(slug="mens-scrubs", defaults={"name": "Men's Scrubs", "image": "categories/men.png"})
    acc_cat, _ = Category.objects.get_or_create(slug="accessories", defaults={"name": "Accessories", "image": "categories/accessories.png"})
    lab_cat, _ = Category.objects.get_or_create(slug="lab-coats", defaults={"name": "Lab Coats", "image": "categories/accessories.png"})
    shoes_cat, _ = Category.objects.get_or_create(slug="footwear", defaults={"name": "Medical Footwear", "image": "categories/accessories.png"})

    # 2. Define 15 Products
    products_data = [
        # Women's Scrubs
        {"slug": "women-pro-stretch-top", "name": "Pro-Stretch Scrub Top (Women)", "category": women_cat, "price": 38.50, "image": "products/classic-scrub-top.png", "desc": "Advanced 4-way stretch fabric for maximum mobility."},
        {"slug": "women-elite-joggers", "name": "Elite Jogger Scrub Pants (Women)", "category": women_cat, "price": 45.00, "image": "products/classic-scrub-top.png", "desc": "Athletic fit scrub joggers with 5 pockets."},
        {"slug": "women-classic-vneck", "name": "Classic V-Neck Top (Women)", "category": women_cat, "price": 30.00, "image": "products/classic-scrub-top.png", "desc": "Traditional, reliable scrub top with a flattering fit."},
        {"slug": "women-cargo-pants", "name": "Utility Cargo Pants (Women)", "category": women_cat, "price": 42.00, "image": "products/classic-scrub-top.png", "desc": "Multi-pocket cargo pants for professionals on the go."},
        
        # Men's Scrubs
        {"slug": "men-performance-top", "name": "Performance Scrub Top (Men)", "category": men_cat, "price": 40.00, "image": "products/essential-pants.png", "desc": "Moisture-wicking, anti-microbial top."},
        {"slug": "men-essential-pants", "name": "Essential Straight Leg Pants (Men)", "category": men_cat, "price": 42.50, "image": "products/essential-pants.png", "desc": "Durable, wrinkle-resistant pants."},
        {"slug": "men-active-joggers", "name": "Active Fit Joggers (Men)", "category": men_cat, "price": 48.00, "image": "products/essential-pants.png", "desc": "Modern athletic styling with zip pockets."},
        
        # Lab Coats
        {"slug": "premium-white-coat", "name": "Premium White Lab Coat", "category": lab_cat, "price": 65.00, "image": "products/lab-coat.png", "desc": "Tailored fit, fluid-resistant professional lab coat."},
        {"slug": "consultation-jacket", "name": "Short Consultation Jacket", "category": lab_cat, "price": 55.00, "image": "products/lab-coat.png", "desc": "Professional short jacket for clinical consultations."},
        
        # Accessories
        {"slug": "compression-socks-pack", "name": "Compression Socks (3-Pack)", "category": acc_cat, "price": 25.00, "image": "categories/accessories.png", "desc": "20-30 mmHg compression socks to reduce leg fatigue."},
        {"slug": "pro-stethoscope-case", "name": "Pro Stethoscope Case", "category": acc_cat, "price": 18.00, "image": "categories/accessories.png", "desc": "Hard-shell protective case for your stethoscope."},
        {"slug": "badge-reel-heavy", "name": "Heavy-Duty Badge Reel", "category": acc_cat, "price": 8.50, "image": "categories/accessories.png", "desc": "Retractable badge reel with carabiner clip."},
        {"slug": "surgical-cap-printed", "name": "Printed Surgical Cap", "category": acc_cat, "price": 15.00, "image": "categories/accessories.png", "desc": "Breathable, adjustable surgical cap with sweatband."},
        
        # Footwear
        {"slug": "comfort-clogs", "name": "Ultra-Comfort Medical Clogs", "category": shoes_cat, "price": 85.00, "image": "categories/accessories.png", "desc": "Slip-resistant, easy-to-clean nursing clogs."},
        {"slug": "active-nursing-shoes", "name": "Active Nursing Sneakers", "category": shoes_cat, "price": 95.00, "image": "categories/accessories.png", "desc": "Lightweight sneakers designed for 12-hour shifts."}
    ]

    created_products = []
    for p in products_data:
        prod, _ = Product.objects.get_or_create(
            slug=p["slug"],
            defaults={
                "name": p["name"],
                "category": p["category"],
                "price": p["price"],
                "description": p["desc"],
                "image": p["image"]
            }
        )
        created_products.append(prod)

    # 3. Create Variants
    colors = ["Navy", "Ceil", "Black", "Burgundy", "Hunter Green"]
    sizes = ["XS", "S", "M", "L", "XL", "XXL"]

    for prod in created_products:
        # For accessories, maybe just one size/color
        if prod.category.name == "Accessories":
            ProductVariant.objects.get_or_create(product=prod, color="Standard", size="One Size", defaults={"stock": 50})
        elif prod.category.name == "Medical Footwear":
            for size in ["38", "39", "40", "41", "42", "43", "44"]:
                ProductVariant.objects.get_or_create(product=prod, color="White", size=size, defaults={"stock": random.randint(5, 20)})
                ProductVariant.objects.get_or_create(product=prod, color="Black", size=size, defaults={"stock": random.randint(5, 20)})
        else:
            # Scrubs and Lab Coats
            for color in colors:
                # Lab coats usually just white
                c = "White" if "Lab Coat" in prod.category.name else color
                for size in sizes:
                    ProductVariant.objects.get_or_create(product=prod, color=c, size=size, defaults={"stock": random.randint(10, 50)})
                if "Lab Coat" in prod.category.name:
                    break # only white

    print(f"Database populated successfully with {len(created_products)} products!")

if __name__ == "__main__":
    populate()
