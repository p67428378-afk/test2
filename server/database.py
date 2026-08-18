import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./expenses.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import Category
    from uuid import uuid4

    default_categories = [
        {
            "name": "Food & Dining",
            "description": "Groceries, restaurants, and food items",
        },
        {
            "name": "Transport",
            "description": "Public transit, gas, taxi, and vehicle maintenance",
        },
        {
            "name": "Utilities",
            "description": "Electricity, water, internet, and phone bills",
        },
        {
            "name": "Entertainment",
            "description": "Movies, games, subscriptions, and leisure",
        },
        {
            "name": "Shopping",
            "description": "Clothing, electronics, and general merchandise",
        },
        {
            "name": "Health & Medical",
            "description": "Medical expenses, pharmacy, and wellness",
        },
    ]

    for cat_data in default_categories:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(
                id=str(uuid4()),
                name=cat_data["name"],
                description=cat_data["description"],
            )
            db.add(category)
    try:
        db.commit()
    except Exception:
        db.rollback()
