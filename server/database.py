import os
import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    try:
        return pwd_context.hash(password)
    except Exception:
        # Fallback if bcrypt algorithm has issue in environment
        import hashlib

        return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        import hashlib

        return (
            hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
            == hashed_password
        )


def init_db() -> None:
    """Initialize database tables idempotently."""
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    """Seed initial required accounts idempotently."""
    from server.models import User

    seed_users = [
        {
            "email": "test@example.com",
            "full_name": "Alice Resident",
            "password": "testpassword",
            "role": "resident",
            "unit_number": "4B",
        },
        {
            "email": "admin@example.com",
            "full_name": "Admin Supervisor",
            "password": "adminpassword",
            "role": "admin",
            "unit_number": "1A",
        },
        {
            "email": "guard@example.com",
            "full_name": "Gate Guard Bob",
            "password": "guardpassword",
            "role": "guard",
            "unit_number": "Main Gate",
        },
    ]

    for user_data in seed_users:
        try:
            existing = (
                db.query(User).filter_map({"email": user_data["email"]}).first()
                if hasattr(db.query(User), "filter_map")
                else db.query(User).filter(User.email == user_data["email"]).first()
            )
            if not existing:
                user = User(
                    email=user_data["email"],
                    full_name=user_data["full_name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    unit_number=user_data["unit_number"],
                    is_active=True,
                )
                db.add(user)
                db.commit()
        except IntegrityError:
            db.rollback()
        except Exception as e:
            db.rollback()
            logger.warning(f"Seeding user {user_data['email']} failed: {e}")


def get_db() -> Generator[Session, None, None]:
    """Dependency to provide database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
