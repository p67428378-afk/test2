from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Box, Review
from server.schemas import (
    BoxSummary,
    BoxDetail,
    BoxListResponse,
    CurationSchema,
    ReviewSchema,
)

router = APIRouter(prefix="/api/v1/boxes", tags=["boxes"])


@router.get("", response_model=BoxListResponse)
def get_boxes(
    category_id: Optional[str] = Query(None, description="Filter by Category UUID"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum box price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum box price"),
    min_rating: Optional[float] = Query(
        None, ge=0, le=5, description="Minimum average rating (1-5)"
    ),
    search: Optional[str] = Query(
        None, description="Full-text search in title and description"
    ),
    billing_frequency: Optional[str] = Query(
        None, description="Filter by billing frequency (e.g. Monthly)"
    ),
    skip: int = Query(0, ge=0, description="Pagination skip offset"),
    limit: int = Query(20, ge=1, le=100, description="Pagination limit"),
    db: Session = Depends(get_db),
):
    query = db.query(Box).filter(Box.is_active == True)

    if category_id:
        query = query.filter(Box.category_id == category_id)

    if min_price is not None:
        query = query.filter(Box.price >= min_price)

    if max_price is not None:
        query = query.filter(Box.price <= max_price)

    if min_rating is not None:
        query = query.filter(Box.average_rating >= min_rating)

    if billing_frequency:
        query = query.filter(Box.billing_frequency.ilike(billing_frequency))

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(Box.title.ilike(search_pattern), Box.description.ilike(search_pattern))
        )

    total = query.count()
    boxes = (
        query.order_by(Box.average_rating.desc(), Box.title.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    items: List[BoxSummary] = []
    for b in boxes:
        cat_name = b.category.name if b.category else None
        items.append(
            BoxSummary(
                id=b.id,
                title=b.title,
                slug=b.slug,
                category_id=b.category_id,
                category_name=cat_name,
                price=b.price,
                billing_frequency=b.billing_frequency,
                image_url=b.image_url,
                average_rating=b.average_rating,
                total_reviews=b.total_reviews,
                is_active=b.is_active,
            )
        )

    return BoxListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=BoxDetail)
def get_box_detail(id: str, db: Session = Depends(get_db)):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subscription box not found"
        )

    cat_name = box.category.name if box.category else None

    # Load curations
    curations_schema: List[CurationSchema] = []
    for c in box.curations:
        curations_schema.append(
            CurationSchema(
                id=c.id,
                month_year=c.month_year,
                theme_title=c.theme_title,
                highlights=c.highlights,
                item_list=c.item_list or [],
            )
        )

    # Load recent reviews
    reviews = (
        db.query(Review)
        .filter(Review.box_id == box.id)
        .order_by(Review.created_at.desc())
        .all()
    )
    reviews_schema: List[ReviewSchema] = []
    for r in reviews:
        user_name = r.user.full_name if r.user else "Subscriber"
        reviews_schema.append(
            ReviewSchema(
                id=r.id,
                box_id=r.box_id,
                user_id=r.user_id,
                user_name=user_name,
                rating=r.rating,
                comment=r.comment,
                created_at=r.created_at,
            )
        )

    return BoxDetail(
        id=box.id,
        category_id=box.category_id,
        category_name=cat_name,
        title=box.title,
        slug=box.slug,
        description=box.description,
        price=box.price,
        billing_frequency=box.billing_frequency,
        image_url=box.image_url,
        average_rating=box.average_rating,
        total_reviews=box.total_reviews,
        is_active=box.is_active,
        curations=curations_schema,
        reviews=reviews_schema,
    )
