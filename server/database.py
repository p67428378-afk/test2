import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
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
    from server.models import PasswordLog, User  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """Seed test and admin accounts idempotently."""
    from server.crud import get_password_hash, get_user_by_email
    from server.models import User

    test_accounts = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test Member",
            "role": "member",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "System Admin",
            "role": "admin",
        },
        {
            "email": "librarian@example.com",
            "password": "testpassword",
            "full_name": "Head Librarian",
            "role": "librarian",
        },
    ]

    for acc in test_accounts:
        existing = get_user_by_email(db, acc["email"])
        if not existing:
            try:
                user = User(
                    id=str(uuid.uuid4()),
                    email=acc["email"],
                    hashed_password=get_password_hash(acc["password"]),
                    full_name=acc["full_name"],
                    role=acc["role"],
                    is_active=True,
                    is_verified=True,
                )
                db.add(user)
                db.commit()
            except IntegrityError:
                db.rollback()
