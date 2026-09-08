from fastapi import APIRouter, status
from server.schemas import HealthResponse

router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Service Health Check",
    description="Check the availability and operational health of the Travel Recommendation API service.",
)
def health_check() -> HealthResponse:
    return HealthResponse(status="healthy", service="travel-recommendation-api")
