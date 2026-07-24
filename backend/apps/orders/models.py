from django.db import models
from django.core.validators import MinValueValidator
from apps.catalog.models import TimeStampedModel, Product 

class OrderStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    PROCESSING = "processing", "Processing"
    SHIPPED = "shipped", "Shipped"
    DELIVERED = "delivered", "Delivered"
    CANCELLED = "cancelled", "Cancelled"

ALLOWED_TRANSITIONS = {
    OrderStatus.PENDING:    {OrderStatus.PROCESSING, OrderStatus.CANCELLED},
    OrderStatus.PROCESSING: {OrderStatus.SHIPPED, OrderStatus.CANCELLED},
    OrderStatus.SHIPPED:    {OrderStatus.DELIVERED},
    OrderStatus.DELIVERED:  set(),
    OrderStatus.CANCELLED:  set(),
}

class Order(TimeStampedModel):
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    total = models.DecimalField(max_digits=10, decimal_places=2)  # saved as a snapshot
    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

class OrderItem(models.Model):
    # an order item is linked to a specific order and product variant, and it stores the product name, unit price, and quantity as snapshots to preserve historical data even if the product details change later.
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.SET_NULL, null=True) 
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)                  # saved as a snapshot
    color = models.CharField(max_length=50) 
    size = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)  # saved as a snapshot
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"