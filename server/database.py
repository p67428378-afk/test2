"""Database setup and session management."""

import os
import uuid
from datetime import datetime, timezone
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency for obtaining database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hash(password: str) -> str:
    """Hash a plaintext password with bcrypt."""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8")[:72],
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False


def seed_data(db: Session):
    """Idempotently seed default test accounts and sample data."""
    from server.models import Project, Task, User

    # Seed Member account
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            full_name="Test User",
            role="Member",
            hashed_password=get_password_hash("testpassword"),
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(test_user)
        try:
            db.commit()
            db.refresh(test_user)
        except Exception:
            db.rollback()
            test_user = db.query(User).filter(User.email == "test@example.com").first()

    # Seed Admin account
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            full_name="Admin User",
            role="Admin",
            hashed_password=get_password_hash("adminpassword"),
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(admin_user)
        try:
            db.commit()
            db.refresh(admin_user)
        except Exception:
            db.rollback()
            admin_user = (
                db.query(User).filter(User.email == "admin@example.com").first()
            )

    # Seed a sample project if none exist
    if admin_user and not db.query(Project).first():
        sample_proj = Project(
            id=str(uuid.uuid4()),
            name="Sample Project",
            description="Default initial project for TaskFlow workflow system",
            status="In Progress",
            owner_id=admin_user.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(sample_proj)
        try:
            db.commit()
            db.refresh(sample_proj)

            # Sample Task
            sample_task = Task(
                id=str(uuid.uuid4()),
                project_id=sample_proj.id,
                assignee_id=test_user.id if test_user else admin_user.id,
                summary="Initial System Setup",
                description="Verify all services and endpoints are operational",
                priority="Medium",
                status="In Progress",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(sample_task)
            db.commit()
        except Exception:
            db.rollback()


def init_db():
    """Create all tables and seed default accounts."""
    import server.models  # ensure models are registered with Base.metadata # noqa: F401

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
