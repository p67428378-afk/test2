
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from uuid import UUID

router = APIRouter()

@router.get("/devotees/{devotee_id}/sankalpa-details", response_model=schemas.SankalpaDetails)
def read_devotee_sankalpa_details(devotee_id: UUID, db: Session = Depends(get_db)):
    details = crud.get_devotee_sankalpa_details(db, devotee_id=devotee_id)
    if details is None:
        raise HTTPException(status_code=404, detail="Devotee not found")
    return details
