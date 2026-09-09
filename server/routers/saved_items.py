"""Saved / Bookmarked Recommendations endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Product, SavedRecommendation
from server.schemas import (
    SavedItemCreate,
    SavedItemDeleteResponse,
    SavedItemListResponse,
    SavedItemResponse,
    SavedProductInfo,
)

router = APIRouter()


@router.post(
    "/saved", response_model=SavedItemResponse, status_code=status.HTTP_201_CREATED
)
def bookmark_recommendation(
    payload: SavedItemCreate,
    db: Session = Depends(get_db),
):
    """
    Bookmark a recommended item to the user's personalized saved list.
    Enforces duplicate bookmark protection (returns 409 Conflict if already saved).
    """
    user_id = payload.user_id.strip()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id cannot be empty",
        )

    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {payload.product_id} not found",
        )

    # Check for duplicate bookmark
    existing = (
        db.query(SavedRecommendation)
        .filter(
            SavedRecommendation.user_id == user_id,
            SavedRecommendation.product_id == payload.product_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Item already bookmarked to saved items list.",
        )

    saved = SavedRecommendation(
        user_id=user_id,
        product_id=payload.product_id,
        recommendation_id=payload.recommendation_id,
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)

    prod_info = SavedProductInfo(
        id=product.id,
        name=product.name,
        price=product.price,
        rating=product.rating or 0.0,
        category=product.category,
        description=product.description,
        tags=product.tags or [],
    )

    return SavedItemResponse(
        id=saved.id,
        user_id=saved.user_id,
        product_id=saved.product_id,
        recommendation_id=saved.recommendation_id,
        product=prod_info,
        created_at=saved.created_at,
    )


@router.get("/saved", response_model=SavedItemListResponse)
def list_saved_items(
    user_id: str | None = None,
    skip: int | None = 0,
    limit: int | None = 20,
    db: Session = Depends(get_db),
):
    """
    List bookmarked saved items with pagination.
    """
    if skip is None or skip < 0:
        skip = 0
    if limit is None or limit <= 0:
        limit = 20

    query = db.query(SavedRecommendation)
    if user_id and user_id.strip():
        query = query.filter(SavedRecommendation.user_id == user_id.strip())

    total = query.count()
    saved_items = (
        query.order_by(desc(SavedRecommendation.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    items: list[SavedItemResponse] = []
    for s in saved_items:
        prod_info = None
        if s.product:
            prod_info = SavedProductInfo(
                id=s.product.id,
                name=s.product.name,
                price=s.product.price,
                rating=s.product.rating or 0.0,
                category=s.product.category,
                description=s.product.description,
                tags=s.product.tags or [],
            )

        items.append(
            SavedItemResponse(
                id=s.id,
                user_id=s.user_id,
                product_id=s.product_id,
                recommendation_id=s.recommendation_id,
                product=prod_info,
                created_at=s.created_at,
            )
        )

    return SavedItemListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.delete("/saved/{saved_id}", response_model=SavedItemDeleteResponse)
def delete_saved_item(
    saved_id: str,
    db: Session = Depends(get_db),
):
    """
    Remove an item from the saved items list by ID.
    """
    item = (
        db.query(SavedRecommendation).filter(SavedRecommendation.id == saved_id).first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Saved item with id {saved_id} not found",
        )

    db.delete(item)
    db.commit()

    return SavedItemDeleteResponse(
        status="deleted",
        saved_id=saved_id,
    )
