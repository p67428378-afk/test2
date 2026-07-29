from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from server.config import settings

# For SQLite, we need to allow multi-threaded access
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
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
    from server.models import User
    from server.auth import get_password_hash

    # Seed regular user
    regular_user = db.query(User).filter(User.email == "test@example.com").first()
    if not regular_user:
        regular_user = User(
            email="test@example.com",
            full_name="Test User",
            password_hash=get_password_hash("testpassword"),
            role="user",
        )
        db.add(regular_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()

    # Seed admin user
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@example.com",
            full_name="Admin User",
            password_hash=get_password_hash("adminpassword"),
            role="admin",
        )
        db.add(admin_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
