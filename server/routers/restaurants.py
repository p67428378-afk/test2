"""
Module: server.routers.restaurants
Purpose: Restaurants router.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from server.database import get_db
from server.models.restaurant import Restaurant
from server.models.menu import MenuItem
from server.models.order import Order
from server.models.user import User
from server.routers.auth import get_current_user
from server.schemas.restaurant import (
    RestaurantCreate,
    RestaurantUpdate,
    RestaurantResponse,
    RestaurantDetailResponse,
)
from server.schemas.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("", response_model=List[RestaurantResponse])
def list_restaurants(
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """
    Get a list of restaurants with optional filters for cuisine and rating.
    """
    query = db.query(Restaurant)
    if cuisine:
        query = query.filter(Restaurant.cuisine.ilike(f"%{cuisine}%"))
    if min_rating is not None:
        query = query.filter(Restaurant.rating >= min_rating)

    restaurants = (
        query.order_by(Restaurant.created_at.desc()).offset(skip).limit(limit).all()
    )
    return restaurants


@router.get("/{id}", response_model=RestaurantDetailResponse)
def get_restaurant(id: str, db: Session = Depends(get_db)):
    """
    Get details of a specific restaurant including its menu items.
    """
    restaurant = (
        db.query(Restaurant)
        .options(joinedload(Restaurant.menu_items))
        .filter(Restaurant.id == id)
        .first()
    )

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )
    return restaurant


@router.post("", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant(
    payload: RestaurantCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new restaurant profile (for restaurant partners).
    """
    if current_user.role != "restaurant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurant partners can create profiles",
        )

    db_restaurant = Restaurant(
        owner_id=current_user.id,
        name=payload.name,
        cuisine=payload.cuisine,
        address=payload.address,
        operating_hours=payload.operating_hours,
        delivery_fee=payload.delivery_fee,
        delivery_time=payload.delivery_time,
        rating=0.0,
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


@router.put("/{id}", response_model=RestaurantResponse)
def update_restaurant(
    id: str,
    payload: RestaurantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update restaurant profile.
    """
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )

    if restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the restaurant owner can update the profile",
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(restaurant, field, value)

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)
    return restaurant


@router.post(
    "/{id}/menu", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED
)
def add_menu_item(
    id: str,
    payload: MenuItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add a new menu item to a restaurant.
    """
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )

    if restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the restaurant owner can add menu items",
        )

    db_menu_item = MenuItem(
        restaurant_id=restaurant.id,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        image_url=payload.image_url,
        is_available=payload.is_available if payload.is_available is not None else True,
    )
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item


@router.put("/{id}/menu/{menu_item_id}", response_model=MenuItemResponse)
def update_menu_item(
    id: str,
    menu_item_id: str,
    payload: MenuItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing menu item.
    """
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )

    if restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the restaurant owner can update menu items",
        )

    menu_item = (
        db.query(MenuItem)
        .filter(MenuItem.id == menu_item_id, MenuItem.restaurant_id == restaurant.id)
        .first()
    )

    if not menu_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found"
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(menu_item, field, value)

    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)
    return menu_item


@router.get("/{id}/analytics")
def get_restaurant_analytics(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get restaurant analytics (sales history, total revenue, total orders, and customer feedback).
    """
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found"
        )

    if restaurant.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the restaurant owner or administrators can view analytics",
        )

    # Total orders
    total_orders = db.query(Order).filter(Order.restaurant_id == restaurant.id).count()

    # Total revenue (sum of total_amount of paid orders)
    total_revenue_query = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.restaurant_id == restaurant.id, Order.payment_status == "paid")
        .scalar()
    )
    total_revenue = (
        float(total_revenue_query) if total_revenue_query is not None else 0.0
    )

    # Sales history (orders grouped by status)
    sales_history = (
        db.query(Order.status, func.count(Order.id))
        .filter(Order.restaurant_id == restaurant.id)
        .group_by(Order.status)
        .all()
    )
    sales_history_dict = {status: count for status, count in sales_history}

    # Customer feedback (ratings and comments)
    feedback_list = (
        db.query(Order.id, Order.rating, Order.feedback, Order.created_at)
        .filter(Order.restaurant_id == restaurant.id, Order.rating.isnot(None))
        .order_by(Order.created_at.desc())
        .all()
    )

    feedback_data = [
        {
            "order_id": f[0],
            "rating": float(f[1]) if f[1] is not None else None,
            "feedback": f[2],
            "created_at": f[3],
        }
        for f in feedback_list
    ]

    return {
        "restaurant_id": restaurant.id,
        "restaurant_name": restaurant.name,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "sales_history": sales_history_dict,
        "feedback": feedback_data,
    }
