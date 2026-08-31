from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Guide, Tour, Review
from server.schemas import (
    GuideMetricsResponse,
    FeedbackSummaryResponse,
    TourSummaryItem,
)

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Metrics & Feedback"])


@router.get("/guides/{guide_id}/metrics", response_model=GuideMetricsResponse)
def get_admin_guide_metrics(guide_id: str, db: Session = Depends(get_db)):
    guide = db.query(Guide).filter(Guide.id == guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
        )

    reviews = (
        db.query(Review)
        .filter(Review.guide_id == guide_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    total_reviews = len(reviews)
    breakdown = {"1_star": 0, "2_star": 0, "3_star": 0, "4_star": 0, "5_star": 0}
    recent_comments = []
    total_score = 0

    for r in reviews:
        if 1 <= r.rating <= 5:
            key = f"{r.rating}_star"
            breakdown[key] = breakdown.get(key, 0) + 1
            total_score += r.rating
        if r.comment:
            recent_comments.append(r.comment)

    avg_rating = round(total_score / total_reviews, 2) if total_reviews > 0 else 0.0

    return GuideMetricsResponse(
        guide_id=guide.id,
        guide_name=guide.name,
        average_rating=avg_rating,
        total_reviews=total_reviews,
        rating_breakdown=breakdown,
        recent_comments=recent_comments[:10],
    )


@router.get("/feedback/summary", response_model=FeedbackSummaryResponse)
def get_admin_feedback_summary(db: Session = Depends(get_db)):
    all_reviews = db.query(Review).all()
    total_reviews_collected = len(all_reviews)

    total_score = sum(r.rating for r in all_reviews)
    system_avg = (
        round(total_score / total_reviews_collected, 2)
        if total_reviews_collected > 0
        else 0.0
    )

    tours = db.query(Tour).all()
    tours_summary = []

    for tour in tours:
        tour_reviews = [r for r in all_reviews if r.tour_id == tour.id]
        t_count = len(tour_reviews)
        t_score = sum(r.rating for r in tour_reviews)
        t_avg = round(t_score / t_count, 2) if t_count > 0 else 0.0

        tours_summary.append(
            TourSummaryItem(
                tour_id=tour.id,
                tour_title=tour.title,
                average_rating=t_avg,
                total_reviews=t_count,
            )
        )

    return FeedbackSummaryResponse(
        total_reviews_collected=total_reviews_collected,
        system_average_rating=system_avg,
        tours_summary=tours_summary,
    )
