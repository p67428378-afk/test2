from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models
    from server.core.security import get_password_hash

    # Seed regular user
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        test_user = models.User(
            email="test@example.com",
            full_name="Test Member",
            role="member",
            hashed_password=get_password_hash("testpassword"),
        )
        db.add(test_user)

    # Seed librarian user
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Admin Librarian",
            role="librarian",
            hashed_password=get_password_hash("adminpassword"),
        )
        db.add(admin_user)

    try:
        db.commit()
    except Exception:
        db.rollback()
