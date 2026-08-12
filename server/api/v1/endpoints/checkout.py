import uuid
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import DBAPIError

from server.database import get_db
from server import models_painting as models
from server.schemas_painting import CheckoutIntentRequest, CheckoutIntentResponse
from server.services.email import send_order_confirmation_email

router = APIRouter()


@router.post("/checkout/intent", response_model=CheckoutIntentResponse)
def create_checkout_intent(
    payload: CheckoutIntentRequest,
    x_idempotency_key: Optional[str] = Header(None, alias="X-Idempotency-Key"),
    db: Session = Depends(get_db),
):
    """
    Process checkout intent with idempotency key, promo code, tax/shipping calculation,
    and pessimistic locking for 1-of-1 original paintings.
    """
    # 1. Idempotency Check
    idempotency_key = (
        x_idempotency_key or f"IDEM-{payload.cart_id}-{payload.customer_email}"
    )
    existing_order = (
        db.query(models.Order)
        .filter(models.Order.idempotency_key == idempotency_key)
        .first()
    )
    if existing_order:
        return CheckoutIntentResponse(
            order_id=existing_order.id,
            order_number=existing_order.order_number,
            customer_email=existing_order.customer_email,
            subtotal=existing_order.subtotal,
            shipping_fee=existing_order.shipping_fee,
            tax_amount=existing_order.tax_amount,
            total_amount=existing_order.total_amount,
            status=existing_order.status,
            payment_intent_id=f"pi_mock_{existing_order.order_number}",
            message="Order already processed (Idempotent response).",
        )

    # 2. Fetch Cart Items
    cart_items = (
        db.query(models.CartItem)
        .filter(models.CartItem.cart_id == payload.cart_id)
        .all()
    )
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot process checkout for an empty cart.",
        )

    # 3. Calculate Financials & Verify Stock with Pessimistic Locking
    subtotal = Decimal("0.0000")
    items_detail = []

    for item in cart_items:
        # Pessimistic locking for 1-of-1 original paintings
        try:
            painting = (
                db.query(models.Painting)
                .filter(models.Painting.id == item.painting_id)
                .with_for_update()
                .first()
            )
        except DBAPIError:
            # Fallback for SQLite in testing
            painting = (
                db.query(models.Painting)
                .filter(models.Painting.id == item.painting_id)
                .first()
            )

        if not painting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Painting ID {item.painting_id} not found.",
            )

        if painting.is_original_one_of_one and (
            painting.stock_quantity < item.quantity or painting.status == "SOLD_OUT"
        ):
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Original 1-of-1 artwork '{painting.title}' is no longer available or already sold.",
            )

        if painting.stock_quantity < item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for artwork '{painting.title}'. Available: {painting.stock_quantity}.",
            )

        # Deduct inventory stock
        painting.stock_quantity -= item.quantity
        if painting.stock_quantity <= 0:
            painting.status = "SOLD_OUT"

        item_total = (item.unit_price * item.quantity).quantize(Decimal("0.0001"))
        subtotal += item_total

        items_detail.append(
            {
                "painting_id": str(item.painting_id),
                "painting_title": painting.title,
                "frame_option_id": str(item.frame_option_id)
                if item.frame_option_id
                else None,
                "custom_width_inches": float(item.custom_width_inches)
                if item.custom_width_inches
                else None,
                "custom_height_inches": float(item.custom_height_inches)
                if item.custom_height_inches
                else None,
                "unit_price": str(item.unit_price),
                "quantity": item.quantity,
                "total_price": str(item_total),
            }
        )

    # Apply promo discount
    discount_rate = Decimal("0.00")
    if payload.promo_code:
        promo = payload.promo_code.upper().strip()
        if promo in ["ART10", "WELCOME10"]:
            discount_rate = Decimal("0.10")
        elif promo in ["ART20", "SPECIAL20"]:
            discount_rate = Decimal("0.20")

    discounted_subtotal = (subtotal * (Decimal("1.00") - discount_rate)).quantize(
        Decimal("0.0001"), rounding=ROUND_HALF_UP
    )

    # Flat shipping fee
    shipping_fee = (
        Decimal("25.0000") if discounted_subtotal > Decimal("0") else Decimal("0.0000")
    )

    # Sales tax rate (8%)
    tax_amount = (discounted_subtotal * Decimal("0.0800")).quantize(
        Decimal("0.0001"), rounding=ROUND_HALF_UP
    )

    total_amount = (discounted_subtotal + shipping_fee + tax_amount).quantize(
        Decimal("0.0001"), rounding=ROUND_HALF_UP
    )

    # 4. Generate Order
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    new_order = models.Order(
        order_number=order_number,
        customer_email=payload.customer_email,
        shipping_address=payload.shipping_address.model_dump(),
        subtotal=discounted_subtotal,
        shipping_fee=shipping_fee,
        tax_amount=tax_amount,
        total_amount=total_amount,
        status="Order Placed",
        idempotency_key=idempotency_key,
        items_json=items_detail,
    )

    db.add(new_order)

    # Clear cart items after successful checkout
    db.query(models.CartItem).filter(
        models.CartItem.cart_id == payload.cart_id
    ).delete()

    db.commit()
    db.refresh(new_order)

    # Send order confirmation email
    send_order_confirmation_email(
        customer_email=new_order.customer_email,
        order_number=new_order.order_number,
        total_amount=str(new_order.total_amount),
        items_summary=f"{len(items_detail)} items",
    )

    return CheckoutIntentResponse(
        order_id=new_order.id,
        order_number=new_order.order_number,
        customer_email=new_order.customer_email,
        subtotal=new_order.subtotal,
        shipping_fee=new_order.shipping_fee,
        tax_amount=new_order.tax_amount,
        total_amount=new_order.total_amount,
        status=new_order.status,
        payment_intent_id=f"pi_mock_{new_order.order_number}",
        client_secret=f"pi_mock_secret_{new_order.order_number}",
        message="Order successfully placed and payment intent generated.",
    )
