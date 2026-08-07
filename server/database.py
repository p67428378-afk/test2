import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# For SQLite, we need connect_args
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

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
    from server.models import Seller
    from server.core.security import get_password_hash

    # Seed regular seller user
    email = "test@example.com"
    hashed_password = get_password_hash("testpassword")

    # Check if already exists
    existing_seller = db.query(Seller).filter(Seller.email == email).first()
    if not existing_seller:
        seller = Seller(
            store_name="Test Store",
            email=email,
            phone_number="+1-555-0199",
            password_hash=hashed_password,
        )
        db.add(seller)
        try:
            db.commit()
            db.refresh(seller)
        except IntegrityError:
            db.rollback()
            # Re-fetch to ensure it's there
            seller = db.query(Seller).filter(Seller.email == email).first()
