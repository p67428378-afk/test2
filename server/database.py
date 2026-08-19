import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./warranty_tracker.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Ensure all models register with Base metadata before create_all
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session = None):
    from passlib.context import CryptContext
    import server.models as models
    from uuid import uuid4

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    close_db_at_end = False
    if db is None:
        db = SessionLocal()
        close_db_at_end = True

    try:
        # Check or create regular user
        test_user = (
            db.query(models.User)
            .filter(models.User.email == "test@example.com")
            .first()
        )
        if not test_user:
            test_user = models.User(
                id=str(uuid4()),
                email="test@example.com",
                full_name="Test User",
                hashed_password=pwd_context.hash("testpassword"),
                is_active=True,
                is_verified=True,
            )
            db.add(test_user)

        # Check or create admin user
        admin_user = (
            db.query(models.User)
            .filter(models.User.email == "admin@example.com")
            .first()
        )
        if not admin_user:
            admin_user = models.User(
                id=str(uuid4()),
                email="admin@example.com",
                full_name="Admin User",
                hashed_password=pwd_context.hash("adminpassword"),
                is_active=True,
                is_verified=True,
            )
            db.add(admin_user)

        db.commit()
    except Exception:
        db.rollback()
    finally:
        if close_db_at_end:
            db.close()
