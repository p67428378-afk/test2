from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import TravelRequestCreate, RecommendationResponse
from server.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])


@router.post(
    "",
    response_model=RecommendationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate AI Travel Recommendations",
    description="Accepts destination, budget, currency, and interests, and returns personalized recommendations.",
)
async def generate_recommendations(
    request_in: TravelRequestCreate,
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    try:
        return await RecommendationService.create_recommendation(db, request_in)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to generate recommendations right now. Please try again later. ({str(e)})",
        )


@router.get(
    "/{recommendation_id}",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Travel Recommendation by ID",
    description="Retrieves a previously generated travel recommendation by its UUID.",
)
def get_recommendation(
    recommendation_id: str,
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    recommendation = RecommendationService.get_recommendation_by_id(
        db, recommendation_id
    )
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation with ID '{recommendation_id}' not found.",
        )
    return recommendation
