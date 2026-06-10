from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server.app import schemas, crud
from server.app.database import get_db

router = APIRouter(
    prefix="/funerals",
    tags=["funerals"]
)

@router.post("", response_model=schemas.FuneralResponse, status_code=status.HTTP_201_CREATED)
def create_funeral(funeral: schemas.FuneralCreate, db: Session = Depends(get_db)):
    # Verify body exists
    db_body = crud.get_body(db=db, body_id=funeral.body_id)
    if not db_body:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Body not found"
        )
    try:
        return crud.create_funeral(db=db, funeral=funeral)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid input data: {str(e)}"
        )

@router.get("", response_model=List[schemas.FuneralResponse])
def list_funerals(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_funerals(db=db, skip=skip, limit=limit)

@router.get("/{funeral_id}", response_model=schemas.FuneralResponse)
def get_funeral(funeral_id: UUID, db: Session = Depends(get_db)):
    db_funeral = crud.get_funeral(db=db, funeral_id=funeral_id)
    if not db_funeral:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funeral not found"
        )
    return db_funeral

@router.put("/{funeral_id}", response_model=schemas.FuneralResponse)
def update_funeral(funeral_id: UUID, funeral_update: schemas.FuneralUpdate, db: Session = Depends(get_db)):
    db_funeral = crud.update_funeral(db=db, funeral_id=funeral_id, funeral_update=funeral_update)
    if not db_funeral:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Funeral not found"
        )
    return db_funeral
