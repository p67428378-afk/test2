"""
Module: server.database
Purpose: Database configuration, engine setup, and seeding utilities.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./warranty_tracker.db")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

# Use StaticPool for SQLite in-memory databases to share connection across threads
poolclass = (
    StaticPool if "sqlite" in DATABASE_URL and ":memory:" in DATABASE_URL else None
)

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    poolclass=poolclass,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    Dependency to get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize the database schema.
    """
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """
    Idempotently seed default test and admin users.
    """
    from server.models import User
    from server.auth import get_password_hash

    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User",
            "role": "user",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin User",
            "role": "admin",
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if existing:
            continue

        hashed_pw = get_password_hash(u_data["password"])
        new_user = User(
            email=u_data["email"],
            hashed_password=hashed_pw,
            full_name=u_data["full_name"],
            role=u_data["role"],
            is_active=True,
            is_verified=True,
        )
        db.add(new_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
