"""
Module: wishlist
Purpose: Wishlist router.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import User
from server.app.schemas import (
    WishlistAddRequest,
    WishlistItemResponse,
    WishlistActionResponse,
)
from server.app.routers.auth import get_current_user
from server.app import crud

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=List[WishlistItemResponse])
def get_wishlist(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Get the current user's wishlist.
    """
    products = crud.get_wishlist_for_user(db, user_id=current_user.id)
    return [
        WishlistItemResponse(
            product_id=p.id, name=p.name, price=p.price, image_url=p.image_url
        )
        for p in products
    ]


@router.post(
    "", response_model=WishlistActionResponse, status_code=status.HTTP_201_CREATED
)
def add_to_wishlist(
    request: WishlistAddRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add a product to the wishlist.
    """
    product = crud.get_product_by_id(db, product_id=request.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    # Check if already in wishlist
    from server.app.models import Wishlist

    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id,
            Wishlist.product_id == request.product_id,
        )
        .first()
    )

    if existing:
        return WishlistActionResponse(
            status="success", message="Product already in wishlist"
        )

    crud.add_to_wishlist(db, user_id=current_user.id, product_id=request.product_id)
    db.commit()
    return WishlistActionResponse(status="success", message="Product added to wishlist")


@router.delete("/{product_id}", response_model=WishlistActionResponse)
def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove a product from the wishlist.
    """
    removed = crud.remove_from_wishlist(
        db, user_id=current_user.id, product_id=product_id
    )
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not in wishlist"
        )
    db.commit()
    return WishlistActionResponse(
        status="success", message="Product removed from wishlist"
    )
