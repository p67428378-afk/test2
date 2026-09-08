import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./travel_app.db")

# SQLite connection args for multi-threading
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(bind_engine=None) -> None:
    """Initialize database tables idempotently."""
    target_engine = bind_engine or engine
    Base.metadata.create_all(bind=target_engine)


def seed_data(db: Session = None) -> None:
    """Idempotently seed default data if needed."""
    close_after = False
    if db is None:
        db = SessionLocal()
        close_after = True
    try:
        # Check-or-create seed if needed
        db.commit()
    except Exception:
        db.rollback()
    finally:
        if close_after:
            db.close()
