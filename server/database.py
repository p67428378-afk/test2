"""Database configuration and session management."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for obtaining database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables idempotently."""
    # Import models here to ensure they are registered with Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db=None):
    """Seed initial data idempotently."""
    from server.models import Document

    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True

    try:
        count = db.query(Document).count()
        if count == 0:
            sample_doc = Document(
                title="Welcome to Markdown Studio",
                content="# Welcome to Markdown Studio\n\nStart typing in **Markdown** to see the live preview on the right!",
            )
            db.add(sample_doc)
            db.commit()
    except Exception:
        db.rollback()
    finally:
        if close_session:
            db.close()
