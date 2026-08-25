import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server.models.category import Category  # noqa: F401
    from server.models.expense import Expense  # noqa: F401
    from server.models.budget import Budget  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models.category import Category

    default_categories = [
        {
            "name": "Food & Dining",
            "color": "#EF4444",
            "icon": "utensils",
            "is_default": True,
        },
        {"name": "Housing", "color": "#F59E0B", "icon": "home", "is_default": True},
        {
            "name": "Transportation",
            "color": "#3B82F6",
            "icon": "car",
            "is_default": True,
        },
        {"name": "Utilities", "color": "#10B981", "icon": "zap", "is_default": True},
        {
            "name": "Entertainment",
            "color": "#8B5CF6",
            "icon": "film",
            "is_default": True,
        },
        {"name": "Healthcare", "color": "#EC4899", "icon": "heart", "is_default": True},
        {
            "name": "Miscellaneous",
            "color": "#6B7280",
            "icon": "tag",
            "is_default": True,
        },
    ]

    for cat_data in default_categories:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            cat = Category(
                id=str(uuid.uuid4()),
                name=cat_data["name"],
                color=cat_data["color"],
                icon=cat_data["icon"],
                is_default=cat_data["is_default"],
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(cat)
    try:
        db.commit()
    except Exception:
        db.rollback()
