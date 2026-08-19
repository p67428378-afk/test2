from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.category import Category
from server.schemas.category import CategoryRead, CategoryCreate
from server.security import get_current_user

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found",
        )
    return category


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing = db.query(Category).filter(Category.name == category_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{category_in.name}' already exists",
        )
    category = Category(name=category_in.name, description=category_in.description)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
