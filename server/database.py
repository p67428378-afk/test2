from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models
    from server.core.security import get_password_hash

    # Ensure tables exist
    init_db()

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
            is_active=True,
            is_verified=True,
        )
        db.add(test_user)

    # Seed admin user
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Admin Organizer",
            role="admin",
            hashed_password=get_password_hash("adminpassword"),
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)

    try:
        db.commit()
    except Exception:
        db.rollback()
