from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/delays", response_model=List[schemas.DelayAlertResponse])
def read_active_delays(
    db: Session = Depends(get_db),
):
    """List active train delay alerts."""
    return crud.get_active_delays(db)
