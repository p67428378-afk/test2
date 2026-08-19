from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.cost_log import CostSummaryResponse
from server.services import cost_service

router = APIRouter(prefix="/costs", tags=["Costs"])


@router.get("/summary", response_model=CostSummaryResponse)
def get_cost_summary(db: Session = Depends(get_db)):
    return cost_service.get_cost_summary(db)
