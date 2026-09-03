import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from server.models.category import Category
from server.schemas.category import CategoryCreate


class CategoryService:
    @staticmethod
    def get_all(db: Session) -> List[Category]:
        """Retrieve all categories sorted alphabetically by name."""
        return db.query(Category).order_by(func.lower(Category.name).asc()).all()

    @staticmethod
    def get_by_id(db: Session, category_id: str) -> Optional[Category]:
        """Retrieve category by ID."""
        return db.query(Category).filter(Category.id == category_id).first()

    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[Category]:
        """Case-insensitive category lookup by name."""
        return (
            db.query(Category)
            .filter(func.lower(Category.name) == func.lower(name.strip()))
            .first()
        )

    @staticmethod
    def create(db: Session, category_in: CategoryCreate) -> Category:
        """Create a new vehicle category.
        
        Enforces case-insensitive uniqueness; raises 409 Conflict if duplicate.
        """
        trimmed_name = category_in.name.strip()
        if not trimmed_name:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Category name cannot be empty",
            )

        existing = (
            db.query(Category)
            .filter(func.lower(Category.name) == func.lower(trimmed_name))
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category '{trimmed_name}' already exists",
            )

        now = datetime.now(timezone.utc)
        category = Category(
            id=str(uuid.uuid4()),
            name=trimmed_name,
            created_at=now,
            updated_at=now,
        )
        db.add(category)
        db.commit()
        db.refresh(category)
        return category
