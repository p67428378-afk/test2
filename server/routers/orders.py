"""
Module: server.routers.orders
Purpose: Orders router.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models.order import Order, OrderItem
from server.models.restaurant import Restaurant
from server.models.menu import MenuItem
from server.models.user import User
from server.models.delivery import Delivery
from server.routers.auth import get_current_user
from server.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderDetailResponse,
    OrderStatusUpdate,
    OrderListResponse,
    OrderFeedbackSubmit,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post(
    "", response_model=OrderDetailResponse, status_code=status.HTTP_201_CREATED
)
def create_order(
    payload: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new order.
    """
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can place orders",
        )

    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )

    restaurant = (
        db.query(Restaurant).filter(Restaurant.id == payload.restaurant_id).first()
    )
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )

    # Calculate total amount and verify items belong to the restaurant
    total_amount = 0.0
    order_items = []

    for item in payload.items:
        menu_item = (
            db.query(MenuItem)
            .filter(
                MenuItem.id == item.menu_item_id,
                MenuItem.restaurant_id == restaurant.id,
            )
            .first()
        )

        if not menu_item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item {item.menu_item_id} not found or does not belong to this restaurant",
            )

        if not menu_item.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item {menu_item.name} is currently not available",
            )

        item_price = float(menu_item.price)
        total_amount += item_price * item.quantity

        order_items.append(
            OrderItem(
                menu_item_id=menu_item.id, quantity=item.quantity, price=item_price
            )
        )

    # Add delivery fee
    total_amount += float(restaurant.delivery_fee)

    db_order = Order(
        user_id=current_user.id,
        restaurant_id=restaurant.id,
        status="pending",
        total_amount=total_amount,
        delivery_address=payload.delivery_address,
        payment_status="pending",
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Add order items
    for order_item in order_items:
        order_item.order_id = db_order.id
        db.add(order_item)

    # Create a delivery record
    db_delivery = Delivery(
        order_id=db_order.id,
        status="assigned",
        earnings=float(restaurant.delivery_fee)
        * 0.8,  # 80% of delivery fee goes to driver
    )
    db.add(db_delivery)

    db.commit()
    db.refresh(db_order)

    # Eager load items
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.menu_item))
        .filter(Order.id == db_order.id)
        .first()
    )


@router.get("", response_model=List[OrderListResponse])
def list_orders(
    role: str,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get orders with filters for role (customer, restaurant, driver).
    """
    query = db.query(Order).options(joinedload(Order.restaurant))

    if role == "customer":
        if current_user.role != "customer" and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
            )
        query = query.filter(Order.user_id == current_user.id)
    elif role == "restaurant":
        # Find restaurants owned by current user
        restaurant_ids = [r.id for r in current_user.restaurants]
        query = query.filter(Order.restaurant_id.in_(restaurant_ids))
    elif role == "driver":
        if current_user.role != "delivery" and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
            )
        # Find deliveries assigned to this driver
        query = query.join(Delivery).filter(Delivery.driver_id == current_user.id)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role filter"
        )

    if status_filter:
        query = query.filter(Order.status == status_filter)

    orders = query.order_by(Order.created_at.desc()).all()

    # Map to OrderListResponse
    result = []
    for o in orders:
        result.append(
            {
                "id": o.id,
                "restaurant_name": o.restaurant.name,
                "status": o.status,
                "total_amount": float(o.total_amount),
                "created_at": o.created_at,
            }
        )
    return result


@router.get("/{id}", response_model=OrderDetailResponse)
def get_order(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get details and status of a specific order.
    """
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.menu_item))
        .filter(Order.id == id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    # Check authorization
    if current_user.role == "customer" and order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
        )
    elif current_user.role == "restaurant":
        restaurant = (
            db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
        )
        if not restaurant or restaurant.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
            )

    return order


@router.put("/{id}/status", response_model=OrderResponse)
def update_order_status(
    id: str,
    payload: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update the status of an order (accept, decline, ready for pickup, etc.).
    """
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    new_status = payload.status.lower()
    allowed_statuses = [
        "accepted",
        "preparing",
        "ready_for_pickup",
        "out_for_delivery",
        "delivered",
        "cancelled",
    ]
    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(allowed_statuses)}",
        )

    # Authorization and transition checks
    restaurant = (
        db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    )
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )

    if current_user.role == "restaurant":
        if restaurant.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized to update this order",
            )

        # Restaurant transitions
        if new_status == "accepted" and order.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only accept pending orders",
            )
        elif new_status == "preparing" and order.status != "accepted":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only prepare accepted orders",
            )
        elif new_status == "ready_for_pickup" and order.status != "preparing":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only mark preparing orders as ready for pickup",
            )
        elif new_status == "cancelled" and order.status not in ["pending", "accepted"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel order at this stage",
            )

    elif current_user.role == "delivery":
        # Driver transitions
        delivery = db.query(Delivery).filter(Delivery.order_id == order.id).first()
        if not delivery:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Delivery record not found",
            )

        if delivery.driver_id and delivery.driver_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized to update this order",
            )

        if new_status == "out_for_delivery":
            if order.status != "ready_for_pickup":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Order is not ready for pickup",
                )
            # Assign driver if not already assigned
            if not delivery.driver_id:
                delivery.driver_id = current_user.id  # type: ignore
            delivery.status = "out_for_delivery"  # type: ignore
        elif new_status == "delivered":
            if order.status != "out_for_delivery":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Order is not out for delivery",
                )
            delivery.status = "delivered"  # type: ignore

        db.add(delivery)

    elif current_user.role == "customer":
        if order.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized to update this order",
            )
        if new_status == "cancelled":
            if order.status != "pending":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Can only cancel pending orders",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Customers can only cancel orders",
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized role"
        )

    order.status = new_status  # type: ignore
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.post("/{id}/feedback", response_model=OrderResponse)
def submit_order_feedback(
    id: str,
    payload: OrderFeedbackSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit rating and feedback for a completed order.
    """
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the customer who placed the order can submit feedback",
        )

    if order.status != "delivered":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only submit feedback for delivered orders",
        )

    order.rating = payload.rating  # type: ignore
    order.feedback = payload.feedback  # type: ignore

    # Update restaurant's average rating
    restaurant = (
        db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    )
    if restaurant:
        # Calculate new average rating
        ratings = (
            db.query(Order.rating)
            .filter(Order.restaurant_id == restaurant.id, Order.rating.isnot(None))
            .all()
        )
        rating_values = [float(r[0]) for r in ratings if r[0] is not None]
        rating_values.append(payload.rating)
        new_avg = sum(rating_values) / len(rating_values)
        restaurant.rating = new_avg  # type: ignore
        db.add(restaurant)

    db.add(order)
    db.commit()
    db.refresh(order)
    return order
