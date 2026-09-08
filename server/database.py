import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

# SQLite specific connect args
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database tables idempotently."""
    # Ensure all models are imported so Base metadata is populated
    from server.models.expense import Expense  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    """Seed initial sample data if table is empty (idempotent)."""
    from server.models.expense import Expense
    import datetime

    try:
        if db.query(Expense).first() is None:
            sample_expenses = [
                Expense(
                    amount=120.50,
                    category="Food & Dining",
                    date=datetime.date.today(),
                    description="Groceries at Trader Joe's",
                ),
                Expense(
                    amount=85.00,
                    category="Housing/Utilities",
                    date=datetime.date.today() - datetime.timedelta(days=1),
                    description="Electric Bill",
                ),
                Expense(
                    amount=45.25,
                    category="Transportation",
                    date=datetime.date.today() - datetime.timedelta(days=2),
                    description="Gas Station",
                ),
            ]
            db.add_all(sample_expenses)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Seed data error or table not ready: {e}")
