from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductVariant
from .serializers import CategorySerializer, ProductSerializer, ProductVariantSerializer

# 1. (Public Storefront) Routes
# to allow customers to view categories and products without authentication
class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug' #/api/categories/slug/

class PublicProductViewSet(viewsets.ReadOnlyModelViewSet):
    # select_related to optimize queries by fetching related category data in the same query (solve n+1 problem)
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug'] # to filter by category
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name']



# 2. (Admin Panel) Routes

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser] 

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name']
    
class AdminProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product'] 