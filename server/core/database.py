import uuid
from datetime import datetime, timezone
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import StaticPool
from server.core.config import settings

DATABASE_URL = settings.DATABASE_URL

if settings.TESTING or "sqlite" in DATABASE_URL:
    if settings.TESTING:
        DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
        if ":memory:" in DATABASE_URL or settings.TESTING
        else None,
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None) -> None:
    """Idempotently create tables."""
    import server.models.todo  # noqa: F401

    eng = target_engine or engine
    Base.metadata.create_all(bind=eng)


def seed_data(db: Session) -> None:
    """Seed initial data idempotently if table is empty."""
    from server.models.todo import Todo

    try:
        count = db.query(Todo).count()
        if count == 0:
            demo_todos = [
                Todo(
                    id=str(uuid.uuid4()),
                    title="Implement FastAPI CRUD endpoints",
                    description="Build GET, POST, PUT, DELETE routes under /api/v1/todos with Pydantic v2 schemas.",
                    completed=False,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                ),
                Todo(
                    id=str(uuid.uuid4()),
                    title="Design React Todo UI components",
                    description="Construct modular React 18 components with Tailwind CSS styling and responsive layout.",
                    completed=True,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                ),
            ]
            db.add_all(demo_todos)
            db.commit()
    except Exception:
        db.rollback()
