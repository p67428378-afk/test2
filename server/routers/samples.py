from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server.database import get_db
from server import crud, schemas

router = APIRouter(prefix="/samples", tags=["samples"])


@router.post(
    "", response_model=schemas.SampleResponse, status_code=status.HTTP_201_CREATED
)
def create_sample(sample: schemas.SampleCreate, db: Session = Depends(get_db)):
    # Check if expedition exists
    db_expedition = crud.get_expedition(db=db, expedition_id=sample.expedition_id)
    if db_expedition is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expedition not found"
        )

    return crud.create_sample(db=db, sample=sample)


@router.get("", response_model=List[schemas.SampleResponse])
def read_samples(
    expedition_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.get_samples(db=db, expedition_id=expedition_id, skip=skip, limit=limit)
