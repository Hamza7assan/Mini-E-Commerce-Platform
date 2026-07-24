from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CheckoutViewSet, AdminOrderViewSet, DashboardStatsView

public_router = DefaultRouter()
public_router.register(r'orders', CheckoutViewSet, basename='checkout')

admin_router = DefaultRouter()
admin_router.register(r'orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    # the public checkout routes will be: /api/orders/
    path('', include(public_router.urls)),
    
    # the admin panel routes will be: /api/admin/orders/
    path('admin/dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('admin/', include(admin_router.urls)),
]