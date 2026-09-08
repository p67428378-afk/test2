from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import (
    ExportRequest,
    ExportResponse,
    RecommendationResponse,
    TravelRequestCreate,
)
from server.services.export_service import export_service
from server.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

DbSession = Annotated[Session, Depends(get_db)]


@router.post("", response_model=RecommendationResponse, status_code=201)
async def create_recommendation(payload: TravelRequestCreate, db: DbSession):
    return await recommendation_service.create_recommendations(db, payload)


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
def get_recommendation(recommendation_id: str, db: DbSession):
    return recommendation_service.get_recommendation_by_id(db, recommendation_id)


@router.post("/export", response_model=ExportResponse, status_code=200)
def export_recommendation(payload: ExportRequest, db: DbSession):
    return export_service.export_itinerary(db, payload)
