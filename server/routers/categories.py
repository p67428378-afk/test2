from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server import crud, schemas
from server.database import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[schemas.CategoryResponse])
@router.get("/", response_model=List[schemas.CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """List all categories."""
    categories = crud.get_categories(db)
    return categories


@router.post("", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """Create a new expense category."""
    existing = crud.get_category_by_name(db, category_in.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with name '{category_in.name}' already exists."
        )
    return crud.create_category(db, category_in)
