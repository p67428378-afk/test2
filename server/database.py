import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./expenses.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    bind_engine = target_engine or engine
    Base.metadata.create_all(bind=bind_engine)


def seed_data(db: Session):
    from server.models.category import Category

    default_categories = [
        {"name": "Food & Dining", "description": "Restaurants, groceries, and cafes"},
        {"name": "Transport", "description": "Public transit, gas, parking, and rideshares"},
        {"name": "Utilities", "description": "Electricity, water, internet, and phone"},
        {"name": "Entertainment", "description": "Movies, concerts, streaming, and hobbies"},
    ]

    for cat_data in default_categories:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(name=cat_data["name"], description=cat_data["description"])
            db.add(category)
    try:
        db.commit()
    except Exception:
        db.rollback()
