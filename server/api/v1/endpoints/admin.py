from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models_painting as models
from server.schemas_painting import (
    PaintingCreate,
    PaintingUpdate,
    PaintingOut,
    OrderStatusUpdate,
    OrderOut,
)
from server.services.email import send_shipping_dispatch_email

router = APIRouter()


@router.get("/admin/orders", response_model=List[OrderOut])
def admin_list_orders(db: Session = Depends(get_db)):
    """
    Get all orders for admin fulfillment management.
    """
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
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


@router.patch("/admin/orders/{order_identifier}", response_model=OrderOut)
def admin_update_order_status(
    order_identifier: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Update order status ('In Production', 'Shipped', 'Delivered', 'Cancelled') and tracking number.
    Triggers notification email on 'Shipped'.
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

    order.status = payload.status
    if payload.tracking_number:
        order.tracking_number = payload.tracking_number

    db.commit()
    db.refresh(order)

    if order.status == "Shipped" and order.tracking_number:
        send_shipping_dispatch_email(
            customer_email=order.customer_email,
            order_number=order.order_number,
            tracking_number=order.tracking_number,
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


@router.post(
    "/admin/paintings", response_model=PaintingOut, status_code=status.HTTP_201_CREATED
)
def admin_create_painting(payload: PaintingCreate, db: Session = Depends(get_db)):
    """
    Create a new artwork listing.
    """
    painting = models.Painting(
        title=payload.title,
        description=payload.description,
        artist_name=payload.artist_name,
        medium=payload.medium,
        style=payload.style,
        base_price=payload.base_price,
        is_configurable=payload.is_configurable,
        is_original_one_of_one=payload.is_original_one_of_one,
        stock_quantity=payload.stock_quantity,
        image_url=payload.image_url,
        status=payload.status,
    )
    db.add(painting)
    db.commit()
    db.refresh(painting)
    return painting


@router.put("/admin/paintings/{painting_id}", response_model=PaintingOut)
def admin_update_painting(
    painting_id: UUID, payload: PaintingUpdate, db: Session = Depends(get_db)
):
    """
    Update artwork listing or stock availability.
    """
    painting = (
        db.query(models.Painting).filter(models.Painting.id == painting_id).first()
    )
    if not painting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Painting not found"
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(painting, field, val)

    db.commit()
    db.refresh(painting)
    return painting
