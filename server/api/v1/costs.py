from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.user import User
from server.schemas.cost import CostSummaryResponse
from server.security import get_current_user
from server.services import cost_service

router = APIRouter(prefix="/costs", tags=["Costs"])


@router.get("/summary", response_model=CostSummaryResponse)
def get_cost_summary(
    start_date: Optional[date] = Query(
        None, description="Start date filter (YYYY-MM-DD)"
    ),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return cost_service.get_cost_summary(
        db, start_date=start_date, end_date=end_date, category_id=category_id
    )
