"""
Module: cart
Purpose: Shopping cart router.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import User
from server.app.schemas import (
    CartAddRequest,
    CartResponse,
    CartItemResponse,
    CartActionResponse,
)
from server.app.routers.auth import get_current_user
from server.app import crud

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
def get_cart(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Get the current user's shopping cart.
    """
    cart_items = crud.get_cart_for_user(db, user_id=current_user.id)
    items_response = []
    total_price = 0.0

    for item in cart_items:
        p = item.product
        if p:
            items_response.append(
                CartItemResponse(
                    product_id=p.id,
                    name=p.name,
                    price=p.price,
                    image_url=p.image_url,
                    quantity=item.quantity,
                )
            )
            total_price += p.price * item.quantity

    return CartResponse(items=items_response, total_price=total_price)


@router.post("", response_model=CartActionResponse)
def add_or_update_cart(
    request: CartAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add or update an item in the shopping cart.
    """
    product = crud.get_product_by_id(db, product_id=request.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    if product.stock < request.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock"
        )

    crud.add_or_update_cart(
        db,
        user_id=current_user.id,
        product_id=request.product_id,
        quantity=request.quantity,
    )
    db.commit()

    return CartActionResponse(status="success", message="Cart updated successfully")
