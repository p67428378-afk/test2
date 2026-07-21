from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from server.config import settings
from sqlalchemy.exc import IntegrityError

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {},
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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models
    from server.auth import get_password_hash

    # Seed regular user
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        test_user = models.User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            login_id="testuser",
            mobile_number="1234567890",
            security_question="What is your favorite color?",
            security_answer_hash=get_password_hash("blue"),
        )
        db.add(test_user)
        try:
            db.commit()
            db.refresh(test_user)
        except IntegrityError:
            db.rollback()
            test_user = (
                db.query(models.User)
                .filter(models.User.email == "test@example.com")
                .first()
            )

    # Seed some initial worklist items for the test user
    if test_user:
        existing_items = (
            db.query(models.WorklistItem)
            .filter(models.WorklistItem.user_id == test_user.id)
            .first()
        )
        if not existing_items:
            items = [
                models.WorklistItem(
                    name="Implement OAuth2 Authentication",
                    status="To Do",
                    user_id=test_user.id,
                ),
                models.WorklistItem(
                    name="Design Database Schema",
                    status="In Progress",
                    user_id=test_user.id,
                ),
                models.WorklistItem(
                    name="Setup CI/CD Pipeline", status="Done", user_id=test_user.id
                ),
                models.WorklistItem(
                    name="Write API Documentation", status="To Do", user_id=test_user.id
                ),
            ]
            db.add_all(items)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
