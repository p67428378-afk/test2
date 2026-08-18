from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from server.models.category import Category
from server.schemas.category import CategoryCreate


def create_category(db: Session, category_in: CategoryCreate) -> Category:
    existing = db.query(Category).filter(Category.name == category_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with name '{category_in.name}' already exists.",
        )
    category = Category(
        name=category_in.name,
        description=category_in.description,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_categories(db: Session) -> List[Category]:
    return db.query(Category).order_by(Category.name.asc()).all()


def get_category_by_id(db: Session, category_id: str) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()
