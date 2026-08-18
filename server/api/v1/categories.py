from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.category import CategoryCreate, CategoryResponse
from server.services import category_service

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db)):
    return category_service.create_category(db, category_in)


@router.get("", response_model=List[CategoryResponse], status_code=status.HTTP_200_OK)
def list_categories(db: Session = Depends(get_db)):
    return category_service.get_categories(db)
