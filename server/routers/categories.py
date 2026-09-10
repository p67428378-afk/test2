from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import CategoryResponse, CategoryCreate
from server import crud

router = APIRouter(prefix="/api/v1/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(
    response: Response, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Fetch all destination categories."""
    response.headers["Cache-Control"] = (
        "public, max-age=300, stale-while-revalidate=600"
    )
    return crud.get_categories(db, skip=skip, limit=limit)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: str, response: Response, db: Session = Depends(get_db)):
    """Fetch a category by ID."""
    cat = crud.get_category(db, category_id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found",
        )
    response.headers["Cache-Control"] = (
        "public, max-age=300, stale-while-revalidate=600"
    )
    return cat


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Create a new destination category."""
    existing = crud.get_category_by_slug(db, category.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with slug '{category.slug}' already exists",
        )
    return crud.create_category(db, category)
