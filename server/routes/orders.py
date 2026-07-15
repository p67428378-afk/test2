from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.models import User, Order, OrderItem, CartItem
from server.schemas import OrderCreateRequest, OrderResponse, OrderItemResponse
from server.routes import get_current_user

router = APIRouter()


@router.post("", response_model=OrderResponse)
def create_order(
    req: OrderCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Get cart items
    cart_items = (
        db.query(CartItem).filter(CartItem.user_id == current_user.user_id).all()
    )
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty cart or payment failed",
        )

    # Calculate total amount
    total_amount = 0.0
    order_items_to_create = []

    for item in cart_items:
        p = item.product
        price = float(p.price)
        qty = item.quantity
        total_amount += price * qty
        order_items_to_create.append((p, qty, price))

    # Create Order
    new_order = Order(
        user_id=current_user.user_id,
        total_amount=total_amount,
        status="completed",  # Assume payment succeeds
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create Order Items
    for p, qty, price in order_items_to_create:
        oi = OrderItem(
            order_id=new_order.order_id,
            product_id=p.product_id,
            quantity=qty,
            price=price,
        )
        db.add(oi)

    # Clear Cart
    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(new_order)

    # Build response
    items_resp = [
        OrderItemResponse(
            product_id=oi.product_id,
            name=oi.product.name,
            price=float(oi.price),
            quantity=oi.quantity,
        )
        for oi in new_order.items
    ]

    return OrderResponse(
        order_id=new_order.order_id,
        total_amount=float(new_order.total_amount),
        status=new_order.status,
        created_at=new_order.created_at,
        items=items_resp,
    )


@router.get("", response_model=List[OrderResponse])
def get_order_history(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.user_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    resp = []
    for o in orders:
        items_resp = [
            OrderItemResponse(
                product_id=oi.product_id,
                name=oi.product.name,
                price=float(oi.price),
                quantity=oi.quantity,
            )
            for oi in o.items
        ]
        resp.append(
            OrderResponse(
                order_id=o.order_id,
                total_amount=float(o.total_amount),
                status=o.status,
                created_at=o.created_at,
                items=items_resp,
            )
        )
    return resp
