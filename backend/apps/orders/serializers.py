from rest_framework import serializers
from .models import Order, OrderItem, OrderStatus, ALLOWED_TRANSITIONS

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'unit_price', 'quantity', 'line_total', 'color', 'size', 'variant', 'product']
        read_only_fields = ['line_total']

class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone', 
            'shipping_address', 'status', 'total', 'items', 'created_at'
        ]
        read_only_fields = ['total', 'status']

class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=OrderStatus.choices)

    def validate_status(self, value):
        current = self.instance.status
        if value not in ALLOWED_TRANSITIONS[current]:
            raise serializers.ValidationError(
                f"Cannot move an order from '{current}' to '{value}'."
            )
        return value