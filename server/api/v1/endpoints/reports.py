from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_librarian

router = APIRouter()


@router.get("/reports/circulation", response_model=schemas.CirculationReportResponse)
def get_circulation_report(
    db: Session = Depends(get_db), current_user: dict = Depends(get_current_librarian)
):
    report = crud.get_circulation_report(db)
    return report
