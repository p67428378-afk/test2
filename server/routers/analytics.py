from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import analytics as crud_analytics
from server.schemas.analytics import (
    AnalyticsSummary,
    CategoryBreakdownItem,
    MonthlyTrendItem,
)

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020),
    db: Session = Depends(get_db),
):
    return crud_analytics.get_analytics_summary(
        db, start_date=start_date, end_date=end_date, month=month, year=year
    )


@router.get("/category-breakdown", response_model=List[CategoryBreakdownItem])
def get_category_breakdown(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020),
    db: Session = Depends(get_db),
):
    return crud_analytics.get_category_breakdown(
        db, start_date=start_date, end_date=end_date, month=month, year=year
    )


@router.get("/monthly-trend", response_model=List[MonthlyTrendItem])
def get_monthly_trend(
    months: int = Query(6, ge=1, le=24),
    db: Session = Depends(get_db),
):
    return crud_analytics.get_monthly_trend(db, months=months)
