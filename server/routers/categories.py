from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import category as crud_category
from server.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from server.models.expense import Expense

router = APIRouter(prefix="/api/v1/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return crud_category.get_categories(db)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db)):
    existing = crud_category.get_category_by_name(db, category_in.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with name '{category_in.name}' already exists",
        )
    return crud_category.create_category(db, category_in)


@router.get("/{id}", response_model=CategoryResponse)
def get_category(id: str, db: Session = Depends(get_db)):
    cat = crud_category.get_category(db, id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return cat


@router.put("/{id}", response_model=CategoryResponse)
def update_category(
    id: str, category_in: CategoryUpdate, db: Session = Depends(get_db)
):
    cat = crud_category.get_category(db, id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    if category_in.name:
        existing = crud_category.get_category_by_name(db, category_in.name)
        if existing and existing.id != id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with name '{category_in.name}' already exists",
            )
    return crud_category.update_category(db, cat, category_in)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(id: str, db: Session = Depends(get_db)):
    cat = crud_category.get_category(db, id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    if cat.is_default:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete default system category",
        )
    linked_expenses_count = db.query(Expense).filter(Expense.category_id == id).count()
    if linked_expenses_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category linked to active expenses",
        )
    crud_category.delete_category(db, cat)
    return None
