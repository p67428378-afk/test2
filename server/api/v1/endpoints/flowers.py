from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import schemas, crud
from server.database import get_db

router = APIRouter()

@router.get("/flowers", response_model=List[schemas.FlowerResponse])
def list_flowers(db: Session = Depends(get_db)):
    try:
        return crud.get_flowers(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/flowers", response_model=schemas.FlowerResponse, status_code=status.HTTP_201_CREATED)
def create_flower(flower: schemas.FlowerCreate, db: Session = Depends(get_db)):
    db_flower = crud.get_flower_by_type(db, flower_type=flower.flower_type)
    if db_flower:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Flower type already exists"
        )
    try:
        return crud.create_flower(db, flower)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
