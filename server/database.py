import os
import uuid
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/museum_app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    # Import models so they register on Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    from server.models import User, Tour
    from server.auth import get_password_hash

    # Seed Users
    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test Visitor",
            "role": "Visitor",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin User",
            "role": "Administrator",
        },
        {
            "email": "guide@example.com",
            "password": "guidepassword",
            "full_name": "John Doe",
            "role": "Guide",
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            user = User(
                id=str(uuid.uuid4()),
                email=u_data["email"],
                password_hash=get_password_hash(u_data["password"]),
                full_name=u_data["full_name"],
                role=u_data["role"],
                is_active=True,
            )
            db.add(user)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    # Seed Sample Tour
    existing_tour = db.query(Tour).filter(Tour.name == "Renaissance Art Tour").first()
    if not existing_tour:
        tour = Tour(
            id=str(uuid.uuid4()),
            name="Renaissance Art Tour",
            description="Explore masterworks from the 15th century with expert art historians.",
            duration_minutes=60,
        )
        db.add(tour)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
