import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# For SQLite, ensure thread safety for multi-threaded server environments
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
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
    """Idempotently initialize database schema."""
    import server.models  # noqa: F401 Ensure models are imported for metadata registration
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    """Seed initial sample group and members idempotently for test and development."""
    from server.models import Group, GroupMember
    from datetime import datetime

    # Check if sample group already exists
    existing_group = db.query(Group).filter(Group.name == "Summer Vacation 2026").first()
    if not existing_group:
        try:
            group = Group(
                name="Summer Vacation 2026",
                description="Group expenses for Summer Vacation trip with friends.",
            )
            db.add(group)
            db.flush()

            members = [
                GroupMember(group_id=group.id, name="User A", email="usera@example.com"),
                GroupMember(group_id=group.id, name="User B", email="userb@example.com"),
                GroupMember(group_id=group.id, name="User C", email="userc@example.com"),
            ]
            db.add_all(members)
            db.commit()
        except Exception:
            db.rollback()
