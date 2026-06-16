from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/alphabets", response_model=List[schemas.AlphabetResponse])
def read_alphabets(db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_learning_data(db)
    alphabets = crud.get_alphabets(db)
    return alphabets

@router.get("/numbers", response_model=List[schemas.NumberResponse])
def read_numbers(db: Session = Depends(get_db)):
    # Ensure data is seeded
    crud.seed_learning_data(db)
    numbers = crud.get_numbers(db)
    return numbers
