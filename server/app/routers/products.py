"""
Module: products
Purpose: Products and categories router.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.schemas import (
    CategoryResponse,
    ProductListResponse,
    ProductDetailResponse,
)
from server.app import crud

router = APIRouter(tags=["products"])


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """
    Get all categories and sub-categories.
    """
    categories = crud.get_categories(db)
    return categories


@router.get("/products/suggestions", response_model=List[str])
def get_search_suggestions(q: str = "", db: Session = Depends(get_db)):
    """
    Get search auto-suggestions as the user types (AC 8).
    """
    return crud.get_search_suggestions(db, query=q)


@router.get("/products", response_model=ProductListResponse)
def list_products(
    brand: Optional[str] = None,
    category_id: Optional[str] = None,
    color: Optional[str] = None,
    size: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """
    Get a list of products with filtering, sorting, and search.
    """
    if limit > 100:
        limit = 100

    items, total = crud.get_products(
        db=db,
        brand=brand,
        category_id=category_id,
        color=color,
        size=size,
        search=search,
        sort_by=sort_by,
        skip=skip,
        limit=limit,
    )

    suggestions = []
    # AC 11: If search yields no results, return suggestions for other products
    if total == 0 and search:
        suggestions = crud.get_product_suggestions(db, limit=5)

    return ProductListResponse(items=items, total=total, suggestions=suggestions)


@router.get("/products/{id}", response_model=ProductDetailResponse)
def get_product(id: str, db: Session = Depends(get_db)):
    """
    Get a single product by ID with details and reviews.
    """
    product = crud.get_product_by_id(db, product_id=id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    # Map reviews to include user_name
    reviews_response = []
    for r in product.reviews:
        reviews_response.append(
            {
                "id": r.id,
                "user_name": r.user.name if r.user else "Anonymous",
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at,
            }
        )

    # AC 3: Support multiple images (split by comma if present, or return single image_url as list)
    images = (
        [img.strip() for img in product.image_url.split(",") if img.strip()]
        if product.image_url
        else []
    )

    return ProductDetailResponse(
        id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        image_url=product.image_url,
        stock=product.stock,
        category_id=product.category_id,
        brand=product.brand,
        size=product.size,
        color=product.color,
        rating=product.rating,
        reviews=reviews_response,
        images=images,
    )
