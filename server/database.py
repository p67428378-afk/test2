import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./food_donation.db")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DATABASE_URL else None,
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
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User
    from server.auth import get_password_hash
    from sqlalchemy.exc import IntegrityError

    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "Test Restaurant Donor",
            "phone": "1234567890",
            "address": "123 Restaurant St",
        },
        {
            "email": "donor@example.com",
            "password": "testpassword",
            "role": "donor",
            "name": "Main Restaurant Donor",
            "phone": "1234567890",
            "address": "123 Restaurant St",
        },
        {
            "email": "ngo@example.com",
            "password": "testpassword",
            "role": "ngo",
            "name": "Helping Hands NGO",
            "phone": "0987654321",
            "address": "456 NGO Way",
        },
        {
            "email": "volunteer@example.com",
            "password": "testpassword",
            "role": "volunteer",
            "name": "Valiant Volunteer",
            "phone": "5555555555",
            "address": "789 Volunteer Blvd",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "role": "admin",
            "name": "System Administrator",
            "phone": "9999999999",
            "address": "100 Admin HQ",
        },
    ]

    for u in users_to_seed:
        if db.query(User).filter(User.email == u["email"]).first():
            continue

        db_user = User(
            email=u["email"],
            hashed_password=get_password_hash(u["password"]),
            role=u["role"],
            name=u["name"],
            phone=u["phone"],
            address=u["address"],
        )
        db.add(db_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
