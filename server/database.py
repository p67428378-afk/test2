from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server.config import settings

# For SQLite, we need check_same_thread=False
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
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
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

    _SEED_USERS = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Elena Rostova",
            "role": "Engineer",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Marcus Vance",
            "role": "Admin",
        },
    ]

    for u in _SEED_USERS:
        if db.query(User).filter(User.email == u["email"]).first():
            continue
        hashed_password = pwd_context.hash(u["password"])
        db_user = User(
            email=u["email"],
            full_name=u["full_name"],
            role=u["role"],
            hashed_password=hashed_password,
        )
        db.add(db_user)
    try:
        db.commit()
    except Exception:
        db.rollback()
