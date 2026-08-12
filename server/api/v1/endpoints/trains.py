from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/trains", response_model=List[schemas.TrainResponse])
def read_trains(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Fetch active train metadata and status."""
    return crud.get_trains(db, skip=skip, limit=limit)


@router.get("/trains/{train_id}", response_model=schemas.TrainDetailResponse)
def read_train(
    train_id: str,
    db: Session = Depends(get_db),
):
    """Fetch detailed train info, route, schedules, and delay alerts."""
    train = crud.get_train_by_id(db, train_id=train_id)
    if not train:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Train with ID '{train_id}' not found.",
        )
    return train
