import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# For SQLite, we need check_same_thread=False
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
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
    from sqlalchemy.exc import IntegrityError

    # Seed regular user
    test_email = "test@example.com"
    test_user = db.query(User).filter(User.email == test_email).first()
    if not test_user:
        hashed_pw = get_password_hash("testpassword")
        new_user = User(email=test_email, hashed_password=hashed_pw)
        db.add(new_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()

    # Seed admin user
    admin_email = "admin@example.com"
    admin_user = db.query(User).filter(User.email == admin_email).first()
    if not admin_user:
        hashed_pw = get_password_hash("adminpassword")
        new_user = User(email=admin_email, hashed_password=hashed_pw)
        db.add(new_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
