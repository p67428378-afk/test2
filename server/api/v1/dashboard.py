from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.dashboard import DashboardSummary
from server.services import dashboard_service

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary_endpoint(db: Session = Depends(get_db)):
    return dashboard_service.get_dashboard_summary(db=db)
