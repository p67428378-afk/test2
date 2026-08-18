import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User
    from server.auth import get_password_hash
    from sqlalchemy.exc import IntegrityError

    _SEED_USERS = [
        {"email": "test@example.com", "password": "testpassword", "role": "user"},
        {"email": "admin@example.com", "password": "adminpassword", "role": "admin"},
    ]

    for u in _SEED_USERS:
        if db.query(User).filter(User.email == u["email"]).first():
            continue
        db_user = User(
            email=u["email"],
            hashed_password=get_password_hash(u["password"]),
            role=u["role"],
        )
        db.add(db_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
