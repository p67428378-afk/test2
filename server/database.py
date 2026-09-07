import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from server.config import settings

# Database Engine setup
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
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
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User
    from server.auth import get_password_hash

    # 1. Seed regular user: test@example.com / testpassword
    regular_user = db.query(User).filter(User.email == "test@example.com").first()
    if not regular_user:
        try:
            regular_user = User(
                id=str(uuid.uuid4()),
                email="test@example.com",
                hashed_password=get_password_hash("testpassword"),
                role="user",
                is_active=True,
                created_at=datetime.now(timezone.utc),
            )
            db.add(regular_user)
            db.commit()
        except Exception:
            db.rollback()

    # 2. Seed admin user: admin@example.com / adminpassword
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        try:
            admin_user = User(
                id=str(uuid.uuid4()),
                email="admin@example.com",
                hashed_password=get_password_hash("adminpassword"),
                role="admin",
                is_active=True,
                created_at=datetime.now(timezone.utc),
            )
            db.add(admin_user)
            db.commit()
        except Exception:
            db.rollback()
