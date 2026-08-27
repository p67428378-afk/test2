import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool if ":memory:" in DATABASE_URL else None,
    )
else:
    engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Idempotently create all tables."""
    import server.models.document  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    """Idempotently seed initial documents if database is empty."""
    from server.models.document import Document

    existing = db.query(Document).first()
    if existing:
        return

    sample_docs = [
        Document(
            id=uuid.UUID("e4b3c2a1-890d-4e5f-b678-9a0b1c2d3e4f"),
            title="Sample Markdown Document",
            content="# Welcome to Markdown Editor\n\nThis is a sample document with **bold** text, *italic* text, and `inline code`.\n\n- Feature 1: Live Preview\n- Feature 2: Fast Formatting\n- Feature 3: Export to .md\n",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        ),
        Document(
            id=uuid.UUID("11111111-2222-3333-4444-555555555555"),
            title="Product Specification",
            content="# Product Specification\n\n## Overview\nMarkdown editor in the browser.\n\n```python\nprint('Hello world!')\n```\n",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        ),
    ]

    try:
        for doc in sample_docs:
            db.add(doc)
        db.commit()
    except Exception:
        db.rollback()
