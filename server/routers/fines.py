from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import FineResponse, FineStatusResponse
from server.services import fine_service

router = APIRouter(prefix="/api/v1/fines", tags=["Public Fines"])


@router.get("/search", response_model=List[FineResponse])
def search_fines(
    license_plate: Optional[str] = Query(
        None, description="Vehicle license plate number"
    ),
    ticket_number: Optional[str] = Query(
        None, description="Citation ticket reference number"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return fine_service.search_fines(
        db=db,
        license_plate=license_plate,
        ticket_number=ticket_number,
        skip=skip,
        limit=limit,
    )


@router.get("/{id}/status", response_model=FineStatusResponse)
def get_fine_status(id: str, db: Session = Depends(get_db)):
    return fine_service.get_fine_status_details(db=db, fine_id=id)
