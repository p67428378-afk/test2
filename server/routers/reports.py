from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas, database

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("", response_model=schemas.ReportResponse)
def read_reports(period: str = "30d", db: Session = Depends(database.get_db)):
    return crud.get_report_metrics(db, period=period)
