from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.category import CategoryCreate, CategoryResponse
from server.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get(
    "",
    response_model=List[CategoryResponse],
    summary="List all vehicle categories",
    description="Retrieve all available vehicle categories sorted alphabetically.",
)
def list_categories(db: Session = Depends(get_db)):
    """Retrieve all vehicle categories sorted alphabetically."""
    return CategoryService.get_all(db)


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new vehicle category",
    description="Create a new vehicle category with case-insensitive uniqueness check.",
)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
):
    """Create a new vehicle category record."""
    return CategoryService.create(db, category_in)


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
    summary="Get vehicle category by ID",
)
def get_category(category_id: str, db: Session = Depends(get_db)):
    """Retrieve a single category by its UUID identifier."""
    category = CategoryService.get_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category_id}' not found",
        )
    return category
