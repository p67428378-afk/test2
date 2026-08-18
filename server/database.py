import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/expense_tracker.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server.models import Category, Expense  # noqa: F401
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import Category

    default_categories = [
        {"name": "Food & Dining", "description": "Groceries, restaurants, fast food, and beverages"},
        {"name": "Transport", "description": "Public transit, gas, ride-sharing, and vehicle maintenance"},
        {"name": "Utilities", "description": "Electricity, water, gas, internet, and phone bills"},
        {"name": "Entertainment", "description": "Movies, concerts, streaming services, and hobbies"},
    ]

    for cat_data in default_categories:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            new_cat = Category(name=cat_data["name"], description=cat_data["description"])
            db.add(new_cat)
    
    try:
        db.commit()
    except Exception:
        db.rollback()
