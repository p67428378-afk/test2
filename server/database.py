import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./job_board.db")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User
    from server.routers.auth import get_password_hash

    _SEED_USERS = [
        {"email": "test@example.com", "password": "testpassword", "role": "job_seeker"},
        {"email": "admin@example.com", "password": "adminpassword", "role": "employer"},
    ]

    for u in _SEED_USERS:
        if db.query(User).filter(User.email == u["email"]).first():
            continue
        db.add(
            User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
            )
        )
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
