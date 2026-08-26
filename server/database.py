import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database schema idempotently."""
    # Import all models before calling create_all
    import server.models.todo  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session = None) -> None:
    """Idempotently seed default data if required."""
    close_at_end = False
    if db is None:
        db = SessionLocal()
        close_at_end = True

    try:
        # Schema is created, no mandatory seeding required for TODO app,
        # but function exists for idempotent initialization.
        pass
    finally:
        if close_at_end:
            db.close()
