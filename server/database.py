import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models so metadata is populated
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User
    from server.auth import get_password_hash

    # 1. Regular owner user
    owner = db.query(User).filter(User.email == "test@example.com").first()
    if not owner:
        owner = User(
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            full_name="Test Owner",
            role="owner",
            is_active=True,
            is_verified=True,
        )
        db.add(owner)

    # 2. Admin user
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Admin User",
            role="admin",
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

    # 3. Vet user
    vet = db.query(User).filter(User.email == "vet@example.com").first()
    if not vet:
        vet = User(
            email="vet@example.com",
            hashed_password=get_password_hash("vetpassword"),
            full_name="Dr. Jane Vet",
            role="vet",
            is_active=True,
            is_verified=True,
        )
        db.add(vet)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
