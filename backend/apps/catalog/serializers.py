from rest_framework import serializers
from .models import Category, Product, ProductVariant

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'is_active']
        
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'color', 'size', 'stock', 'image']
        
class ProductSerializer(serializers.ModelSerializer):
    
    # additional field to include category name in the serialized output instead of just the category ID
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    # nested serializer to include product variants in the serialized output
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    total_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 
            'category', 'category_name', 'image', 'is_active', 'variants', 'total_stock'
        ]

    def get_total_stock(self, obj):
        return sum(variant.stock for variant in obj.variants.all())