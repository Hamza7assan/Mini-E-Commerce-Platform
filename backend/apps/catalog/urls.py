from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminProductVariantViewSet, PublicCategoryViewSet, PublicProductViewSet, AdminCategoryViewSet, AdminProductViewSet

public_router = DefaultRouter()
public_router.register(r'categories', PublicCategoryViewSet, basename='public-categories')
public_router.register(r'products', PublicProductViewSet, basename='public-products')

admin_router = DefaultRouter()
admin_router.register(r'categories', AdminCategoryViewSet, basename='admin-categories')
admin_router.register(r'products', AdminProductViewSet, basename='admin-products')
admin_router.register(r'variants', AdminProductVariantViewSet, basename='admin-variants')

urlpatterns = [
    # the public storefront routes will be: /api/categories/ or /api/products/
    path('', include(public_router.urls)),
    
    # the admin panel routes will be: /api/admin/categories/ or /api/admin/products/
    path('admin/', include(admin_router.urls)),
]