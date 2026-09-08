from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from server.database import get_db
from server.models import Box, Review, User, generate_uuid, get_utc_now
from server.schemas import ReviewCreate, ReviewResponse, ReviewListResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/boxes", tags=["reviews"])


@router.get("/{id}/reviews", response_model=ReviewListResponse)
def get_box_reviews(
    id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription box '{id}' not found",
        )

    query = db.query(Review).filter(Review.box_id == box.id)
    total = query.count()
    reviews = query.order_by(Review.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for r in reviews:
        result.append(
            ReviewResponse(
                id=str(r.id),
                box_id=str(r.box_id),
                user_id=str(r.user_id),
                rating=int(r.rating),
                comment=str(r.comment),
                created_at=r.created_at,
                user_email=str(r.user.email) if r.user else None,
                user_name=str(r.user.full_name) if r.user else None,
            )
        )

    return ReviewListResponse(reviews=result, total=total, skip=skip, limit=limit)


@router.post(
    "/{id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED
)
def submit_box_review(
    id: str,
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    box = db.query(Box).filter(or_(Box.id == id, Box.slug == id)).first()
    if not box:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription box '{id}' not found",
        )

    if not 1 <= review_in.rating <= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be an integer between 1 and 5",
        )

    if not review_in.comment.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review comment cannot be empty",
        )

    # Check if user already reviewed this box
    existing_review = (
        db.query(Review)
        .filter(Review.box_id == box.id, Review.user_id == current_user.id)
        .first()
    )

    if existing_review:
        existing_review.rating = review_in.rating
        existing_review.comment = review_in.comment.strip()
        existing_review.updated_at = get_utc_now()
        review = existing_review
    else:
        review = Review(
            id=generate_uuid(),
            box_id=str(box.id),
            user_id=str(current_user.id),
            rating=review_in.rating,
            comment=review_in.comment.strip(),
            created_at=get_utc_now(),
            updated_at=get_utc_now(),
        )
        db.add(review)

    db.commit()
    db.refresh(review)

    # Recalculate average rating & total reviews for the box
    stats = (
        db.query(
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("total_revs"),
        )
        .filter(Review.box_id == box.id)
        .first()
    )

    if stats and stats.total_revs:
        box.average_rating = round(float(stats.avg_rating), 1)
        box.total_reviews = int(stats.total_revs)
        db.commit()
        db.refresh(box)

    return ReviewResponse(
        id=str(review.id),
        box_id=str(review.box_id),
        user_id=str(review.user_id),
        rating=int(review.rating),
        comment=str(review.comment),
        created_at=review.created_at,
        user_email=str(current_user.email),
        user_name=str(current_user.full_name) if current_user.full_name else None,
    )
