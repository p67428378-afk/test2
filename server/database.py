from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
import bcrypt

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from . import models
    import uuid

    # Seed regular user
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        try:
            test_user = models.User(
                id=uuid.uuid4(),
                email="test@example.com",
                password_hash=get_password_hash("testpassword"),
                is_admin=False,
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
        except Exception:
            db.rollback()

    # Seed admin user
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        try:
            admin_user = models.User(
                id=uuid.uuid4(),
                email="admin@example.com",
                password_hash=get_password_hash("adminpassword"),
                is_admin=True,
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        except Exception:
            db.rollback()
