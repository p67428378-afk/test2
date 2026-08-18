from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.schemas import CategoryResponse
from server import crud

router = APIRouter()


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)
