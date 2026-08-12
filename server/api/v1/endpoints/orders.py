from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models_painting as models
from server.schemas_painting import OrderOut

router = APIRouter()


@router.get("/orders", response_model=List[OrderOut])
def list_orders(
    customer_email: Optional[str] = Query(None), db: Session = Depends(get_db)
):
    """
    List orders for customer email or all orders.
    """
    query = db.query(models.Order)
    if customer_email:
        query = query.filter(models.Order.customer_email == customer_email)
    orders = query.order_by(models.Order.created_at.desc()).all()

    out = []
    for order in orders:
        out.append(
            OrderOut(
                id=order.id,
                order_number=order.order_number,
                customer_email=order.customer_email,
                shipping_address=order.shipping_address,
                subtotal=order.subtotal,
                shipping_fee=order.shipping_fee,
                tax_amount=order.tax_amount,
                total_amount=order.total_amount,
                status=order.status,
                tracking_number=order.tracking_number,
                items=order.items_json,
                created_at=order.created_at,
                updated_at=order.updated_at,
            )
        )
    return out


@router.get("/orders/{order_identifier}", response_model=OrderOut)
def get_order_detail(order_identifier: str, db: Session = Depends(get_db)):
    """
    Get order details by order UUID or order_number.
    """
    order = None
    try:
        val_uuid = UUID(order_identifier)
        order = db.query(models.Order).filter(models.Order.id == val_uuid).first()
    except ValueError:
        pass

    if not order:
        order = (
            db.query(models.Order)
            .filter(models.Order.order_number == order_identifier)
            .first()
        )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        customer_email=order.customer_email,
        shipping_address=order.shipping_address,
        subtotal=order.subtotal,
        shipping_fee=order.shipping_fee,
        tax_amount=order.tax_amount,
        total_amount=order.total_amount,
        status=order.status,
        tracking_number=order.tracking_number,
        items=order.items_json,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


@router.post("/orders/{order_identifier}/cancel", response_model=OrderOut)
def cancel_order(order_identifier: str, db: Session = Depends(get_db)):
    """
    Cancel order. Allowed ONLY if order status is currently 'Order Placed'.
    """
    order = None
    try:
        val_uuid = UUID(order_identifier)
        order = db.query(models.Order).filter(models.Order.id == val_uuid).first()
    except ValueError:
        pass

    if not order:
        order = (
            db.query(models.Order)
            .filter(models.Order.order_number == order_identifier)
            .first()
        )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    if order.status != "Order Placed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order cancellation not permitted when status is '{order.status}'. Cancellation is only allowed when status is 'Order Placed'.",
        )

    order.status = "Cancelled"
    db.commit()
    db.refresh(order)

    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        customer_email=order.customer_email,
        shipping_address=order.shipping_address,
        subtotal=order.subtotal,
        shipping_fee=order.shipping_fee,
        tax_amount=order.tax_amount,
        total_amount=order.total_amount,
        status=order.status,
        tracking_number=order.tracking_number,
        items=order.items_json,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )
