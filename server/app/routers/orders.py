"""
Module: orders
Purpose: Orders router.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import User
from server.app.schemas import (
    OrderCreateRequest,
    OrderResponse,
    OrderDetailResponse,
    OrderItemResponse,
)
from server.app.routers.auth import get_current_user
from server.app import crud

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    request: OrderCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new order (checkout).
    """
    try:
        db_order = crud.create_order_from_cart(
            db=db,
            user_id=current_user.id,
            shipping_address=request.shipping_address,
            payment_method=request.payment_method,
            coupon_code=request.coupon_code,
        )
        db.commit()
        db.refresh(db_order)
        return db_order
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{id}", response_model=OrderDetailResponse)
def get_order(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get an order by ID.
    """
    order = crud.get_order_by_id(db, order_id=id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    # Check authorization: only the order owner or an admin can view the order
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this order",
        )

    items_response = []
    for item in order.items:
        p = item.product
        items_response.append(
            OrderItemResponse(
                product_id=item.product_id,
                name=p.name if p else "Unknown Product",
                price=item.price,
                quantity=item.quantity,
            )
        )

    return OrderDetailResponse(
        id=order.id,
        user_id=order.user_id,
        status=order.status,
        total_price=order.total_price,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method,
        created_at=order.created_at,
        items=items_response,
    )
