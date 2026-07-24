from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Order
from .serializers import OrderSerializer, OrderStatusUpdateSerializer
from .services import create_order

# 1. (Public Checkout)
class CheckoutViewSet(viewsets.ViewSet):
    def create(self, request):
        customer_data = {
            "customer_name": request.data.get("customer_name"),
            "customer_email": request.data.get("customer_email"),
            "customer_phone": request.data.get("customer_phone"),
            "shipping_address": request.data.get("shipping_address"),
        }
        items = request.data.get("items", [])
        
        try:
            # (Service Layer)
            order = create_order(customer_data=customer_data, items=items)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except DjangoValidationError as e:
            return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)



# 2. (Admin Orders) to allow admin users to view and manage orders
class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related('items').all() 
    serializer_class = OrderSerializer 
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    # Custom Endpoint to update order status with validation
    @action(detail=True, methods=['patch'], serializer_class=OrderStatusUpdateSerializer)
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        
        serializer.is_valid(raise_exception=True) 
        
        order.status = serializer.validated_data['status']
        order.save(update_fields=['status'])
        
        return Response(OrderSerializer(order).data)

from rest_framework.views import APIView
from django.db.models import Sum
from apps.catalog.models import Product

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(total_sum=Sum('total'))['total_sum'] or 0
        total_products = Product.objects.count()

        return Response({
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "total_products": total_products
        })