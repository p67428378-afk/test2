import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Box, Review, User
from server.schemas import ReviewCreate, ReviewSchema, ReviewListResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/boxes/{id}/reviews", tags=["reviews"])


@router.get("", response_model=ReviewListResponse)
def get_box_reviews(
    id: str,
    skip: int = Query(0, ge=0, description="Skip pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Limit pagination count"),
    db: Session = Depends(get_db),
):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subscription box not found"
        )

    query = (
        db.query(Review)
        .filter(Review.box_id == box.id)
        .order_by(Review.created_at.desc())
    )
    total = query.count()
    reviews = query.offset(skip).limit(limit).all()

    items: List[ReviewSchema] = []
    for r in reviews:
        user_name = r.user.full_name if r.user else "Verified Subscriber"
        items.append(
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

    return ReviewListResponse(reviews=items, total=total, skip=skip, limit=limit)


@router.post("", response_model=ReviewSchema, status_code=status.HTTP_201_CREATED)
def submit_box_review(
    id: str,
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if review_in.rating < 1 or review_in.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5 stars",
        )

    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Subscription box not found"
        )

    # Check if user already reviewed this box
    existing_review = (
        db.query(Review)
        .filter(Review.box_id == box.id, Review.user_id == current_user.id)
        .first()
    )

    if existing_review:
        existing_review.rating = review_in.rating
        existing_review.comment = review_in.comment
        existing_review.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing_review)
        review = existing_review
    else:
        review = Review(
            id=str(uuid.uuid4()),
            box_id=box.id,
            user_id=current_user.id,
            rating=review_in.rating,
            comment=review_in.comment,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(review)
        db.commit()
        db.refresh(review)

    # Recalculate average_rating and total_reviews for the box
    all_reviews = db.query(Review).filter(Review.box_id == box.id).all()
    if all_reviews:
        box.total_reviews = len(all_reviews)
        box.average_rating = round(
            sum(r.rating for r in all_reviews) / len(all_reviews), 2
        )
    else:
        box.total_reviews = 0
        box.average_rating = 0.0
    db.commit()
    db.refresh(box)

    return ReviewSchema(
        id=review.id,
        box_id=review.box_id,
        user_id=review.user_id,
        user_name=current_user.full_name,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )
