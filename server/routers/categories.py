from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Category
from server.schemas import CategoryResponse

router = APIRouter(prefix="/api/v1/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.name.asc()).all()
    return [CategoryResponse.model_validate(c) for c in categories]
