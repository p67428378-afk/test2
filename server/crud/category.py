import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from server.models.category import Category
from server.schemas.category import CategoryCreate, CategoryUpdate


def get_categories(db: Session) -> List[Category]:
    return db.query(Category).order_by(Category.name.asc()).all()


def get_category(db: Session, category_id: str) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    return db.query(Category).filter(Category.name == name).first()


def create_category(db: Session, category_in: CategoryCreate) -> Category:
    cat = Category(
        id=str(uuid.uuid4()),
        name=category_in.name,
        color=category_in.color,
        icon=category_in.icon,
        is_default=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def update_category(
    db: Session, category: Category, category_in: CategoryUpdate
) -> Category:
    update_data = category_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    category.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()
