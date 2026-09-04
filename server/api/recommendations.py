from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import RecommendationsResponse
from server.services.recommendation_engine import calculate_topic_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/next-topics", response_model=RecommendationsResponse)
def get_next_topics(
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
):
    recommendations = calculate_topic_recommendations(db=db, limit=limit)
    return RecommendationsResponse(recommendations=recommendations)
