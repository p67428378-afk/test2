from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in settings.DATABASE_URL
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

    # Seed Researcher (PI)
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        test_user = models.User(
            email="test@example.com",
            full_name="Dr. Jane Researcher",
            department="Computer Science",
            role="RESEARCHER",
            is_active=True,
            hashed_password=get_password_hash("testpassword"),
        )
        db.add(test_user)

    # Seed Grant Admin
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Admin Director",
            department="Administration",
            role="GRANT_ADMIN",
            is_active=True,
            hashed_password=get_password_hash("adminpassword"),
        )
        db.add(admin_user)

    # Seed Reviewer
    reviewer_user = (
        db.query(models.User)
        .filter(models.User.email == "reviewer@example.com")
        .first()
    )
    if not reviewer_user:
        reviewer_user = models.User(
            email="reviewer@example.com",
            full_name="Prof. John Reviewer",
            department="Biology",
            role="REVIEWER",
            is_active=True,
            hashed_password=get_password_hash("reviewerpassword"),
        )
        db.add(reviewer_user)

    # Seed Committee Member
    committee_user = (
        db.query(models.User)
        .filter(models.User.email == "committee@example.com")
        .first()
    )
    if not committee_user:
        committee_user = models.User(
            email="committee@example.com",
            full_name="Dr. Alice Committee",
            department="Research Office",
            role="COMMITTEE_MEMBER",
            is_active=True,
            hashed_password=get_password_hash("committeepassword"),
        )
        db.add(committee_user)

    try:
        db.commit()
    except Exception:
        db.rollback()
