import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from server.config import settings

# Use SQLite in-memory for tests if TESTING is set
if os.getenv("TESTING") == "true":
    DATABASE_URL = "sqlite:///:memory:"
    connect_args = {"check_same_thread": False}
else:
    DATABASE_URL = settings.DATABASE_URL
    if DATABASE_URL.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    else:
        connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
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
    # Import models here to register them on Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User
    from server.auth import get_password_hash
    from sqlalchemy.exc import IntegrityError

    # Seed regular user
    test_email = "test@example.com"
    test_username = "testuser"
    test_password = "testpassword"

    user = db.query(User).filter(User.email == test_email).first()
    if not user:
        hashed_password = get_password_hash(test_password)
        new_user = User(
            username=test_username, email=test_email, hashed_password=hashed_password
        )
        db.add(new_user)
        try:
            db.commit()
            db.refresh(new_user)
        except IntegrityError:
            db.rollback()
