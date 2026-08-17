import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

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
    from server.security import get_password_hash

    _SEED_USERS = [
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

    for u in _SEED_USERS:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            continue

        hashed_pw = get_password_hash(u["password"])
        db_user = User(
            email=u["email"],
            hashed_password=hashed_pw,
            full_name=u["full_name"],
            role=u["role"],
            is_active=True,
        )
        db.add(db_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
