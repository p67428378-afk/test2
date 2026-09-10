import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

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


def seed_data(db: Session):
    from server.models import UserModel
    from server.services.auth_service import get_password_hash

    try:
        test_user = (
            db.query(UserModel).filter(UserModel.email == "test@example.com").first()
        )
        if not test_user:
            test_user = UserModel(
                email="test@example.com",
                password_hash=get_password_hash("testpassword"),
                full_name="Test User",
                is_active=True,
            )
            db.add(test_user)
            db.commit()
    except IntegrityError:
        db.rollback()

    try:
        admin_user = (
            db.query(UserModel).filter(UserModel.email == "admin@example.com").first()
        )
        if not admin_user:
            admin_user = UserModel(
                email="admin@example.com",
                password_hash=get_password_hash("adminpassword"),
                full_name="Admin User",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
    except IntegrityError:
        db.rollback()


def init_db():
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
