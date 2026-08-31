import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bill_splitter.db")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
pool_kwargs = {"poolclass": StaticPool} if DATABASE_URL == "sqlite:///:memory:" else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    **pool_kwargs,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """Idempotent seed data for testing and initial demo."""
    from server.models import Group, GroupMember
    import uuid
    from datetime import datetime, timezone

    existing_group = db.query(Group).filter(Group.name == "Demo Trip").first()
    if existing_group:
        return

    demo_group = Group(
        id=str(uuid.uuid4()),
        name="Demo Trip",
        description="Demo trip for initial testing",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(demo_group)
    db.flush()

    members = [
        GroupMember(
            id=str(uuid.uuid4()),
            group_id=demo_group.id,
            name="Alice",
            email="alice@example.com",
            created_at=datetime.now(timezone.utc),
        ),
        GroupMember(
            id=str(uuid.uuid4()),
            group_id=demo_group.id,
            name="Bob",
            email="bob@example.com",
            created_at=datetime.now(timezone.utc),
        ),
        GroupMember(
            id=str(uuid.uuid4()),
            group_id=demo_group.id,
            name="Charlie",
            email="charlie@example.com",
            created_at=datetime.now(timezone.utc),
        ),
    ]
    for m in members:
        db.add(m)

    try:
        db.commit()
    except Exception:
        db.rollback()
