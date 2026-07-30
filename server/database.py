from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server.config import settings

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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User
    from server.auth import get_password_hash

    # Seed regular user
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            full_name="Test User",
            role="restaurant",
            address="123 Restaurant St",
            phone_number="123-456-7890",
            is_active=True,
        )
        db.add(test_user)

    # Seed admin user
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Admin User",
            role="admin",
            address="123 Admin St",
            phone_number="987-654-3210",
            is_active=True,
        )
        db.add(admin_user)

    try:
        db.commit()
    except Exception:
        db.rollback()
