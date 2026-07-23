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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models
    import bcrypt

    # Seed regular user
    test_email = "test@example.com"
    test_password = "testpassword"

    # Check if user already exists
    user = db.query(models.User).filter(models.User.email == test_email).first()
    if not user:
        hashed = bcrypt.hashpw(test_password.encode("utf-8"), bcrypt.gensalt()).decode(
            "utf-8"
        )
        # Create user with all required fields
        user = models.User(
            email=test_email,
            hashed_password=hashed,
            full_name="Alex Carter",
            login_id="testuser",
            mobile_number="1234567890",
            security_question="What is your favorite color?",
            security_answer_hash=bcrypt.hashpw(
                "blue".encode("utf-8"), bcrypt.gensalt()
            ).decode("utf-8"),
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()
            user = db.query(models.User).filter(models.User.email == test_email).first()

    # Seed some worklist items for this user if none exist
    if user:
        count = (
            db.query(models.WorklistItem)
            .filter(models.WorklistItem.user_id == user.id)
            .count()
        )
        if count == 0:
            items = [
                models.WorklistItem(
                    user_id=user.id,
                    title="Review new expense report for Q3 travel",
                    status="pending",
                ),
                models.WorklistItem(
                    user_id=user.id,
                    title="Approve time-off request - Sarah Jenkins",
                    status="pending",
                ),
                models.WorklistItem(
                    user_id=user.id,
                    title="Verify KYC documents for account opening",
                    status="in_progress",
                ),
                models.WorklistItem(
                    user_id=user.id,
                    title="Reconcile ledger discrepancies - October",
                    status="completed",
                ),
                models.WorklistItem(
                    user_id=user.id,
                    title="Audit compliance logs for security patch",
                    status="pending",
                ),
            ]
            for item in items:
                db.add(item)
            try:
                db.commit()
            except Exception:
                db.rollback()
