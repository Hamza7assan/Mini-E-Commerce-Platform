from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from apps.catalog.models import Product, ProductVariant
from .models import Order, OrderItem, OrderStatus 


@transaction.atomic
def create_order(*, customer_data: dict, items: list[dict]) -> Order:
    if not items:
        raise ValidationError({"items": "At least one item is required."})

    order = Order.objects.create(status=OrderStatus.PENDING, total=0, **customer_data)
    total = Decimal("0.00")
    errors = []

    for index, item in enumerate(items):
        try:
            variant = ProductVariant.objects.select_for_update().get(pk=item["variant_id"], product__is_active=True)
        except ProductVariant.DoesNotExist:
            errors.append(f"Item {index + 1}: Product variant not found or unavailable.")
            continue

        qty = item["quantity"]
        if qty < 1:
            errors.append(f"Item {index + 1}: Quantity must be at least 1.")
            continue
        
        if variant.stock < qty:
            errors.append(f"Item {index + 1}: Only {variant.stock} left in stock.")
            continue

        variant.stock -= qty
        variant.save(update_fields=["stock"])
        
        OrderItem.objects.create(
            order=order, 
            variant=variant,
            product_name=variant.product.name,
            color=variant.color,
            size=variant.size,
            unit_price=variant.product.price, 
            quantity=qty
        )
        total += variant.product.price * qty

    if errors:
        raise ValidationError({"items": errors})

    order.total = total
    order.save(update_fields=["total"])
    
    return order