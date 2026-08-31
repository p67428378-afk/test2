import os
import uuid
from datetime import datetime, timezone
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/pet_clinic.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(bind_engine=None):
    target_engine = bind_engine or engine
    Base.metadata.create_all(bind=target_engine)


def seed_data(db: Session):
    from server.models import User

    # Check if test user exists
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            full_name="Test Owner",
            role="owner",
            is_active=True,
            is_verified=True,
            email_verified=True,
            disabled=False,
            is_locked=False,
            created_at=datetime.now(timezone.utc),
        )
        db.add(test_user)
        try:
            db.commit()
            db.refresh(test_user)
        except Exception:
            db.rollback()
            test_user = db.query(User).filter(User.email == "test@example.com").first()

    # Admin user
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Admin User",
            role="admin",
            is_active=True,
            is_verified=True,
            email_verified=True,
            disabled=False,
            is_locked=False,
            created_at=datetime.now(timezone.utc),
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

    # Vet user
    vet_user = db.query(User).filter(User.email == "vet@example.com").first()
    if not vet_user:
        vet_user = User(
            id=str(uuid.uuid4()),
            email="vet@example.com",
            hashed_password=get_password_hash("vetpassword"),
            full_name="Dr. Sarah Smith",
            role="vet",
            is_active=True,
            is_verified=True,
            email_verified=True,
            disabled=False,
            is_locked=False,
            created_at=datetime.now(timezone.utc),
        )
        db.add(vet_user)
        try:
            db.commit()
            db.refresh(vet_user)
        except Exception:
            db.rollback()
            vet_user = db.query(User).filter(User.email == "vet@example.com").first()
