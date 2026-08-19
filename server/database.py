import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from passlib.context import CryptContext

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/warranty_tracker.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User
    from sqlalchemy.exc import IntegrityError

    test_users = [
        {
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpassword",
            "is_active": True,
        },
        {
            "email": "admin@example.com",
            "full_name": "Admin User",
            "password": "adminpassword",
            "is_active": True,
        },
    ]

    for user_info in test_users:
        existing = db.query(User).filter(User.email == user_info["email"]).first()
        if not existing:
            hashed = pwd_context.hash(user_info["password"])
            user = User(
                email=user_info["email"],
                full_name=user_info["full_name"],
                hashed_password=hashed,
                is_active=user_info["is_active"],
            )
            try:
                db.add(user)
                db.commit()
            except IntegrityError:
                db.rollback()
