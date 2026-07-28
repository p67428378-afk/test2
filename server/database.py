import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import IntegrityError
from server.config import settings


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False


# Database URL configuration
DATABASE_URL = settings.DATABASE_URL

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


_SEED_USERS = [
    {
        "email": "test@example.com",
        "password": "testpassword",
        "role": "user",
        "full_name": "Test User",
    },
    {
        "email": "admin@example.com",
        "password": "adminpassword",
        "role": "admin",
        "full_name": "Admin User",
    },
]


def seed_data(db):
    from server.models import User

    for u in _SEED_USERS:
        if db.query(User).filter(User.email == u["email"]).first():
            continue
        db.add(
            User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
                full_name=u["full_name"],
                login_id=u["email"].split("@")[0],
                mobile_number="1234567890" if u["role"] == "user" else "0987654321",
                security_question="What is your role?",
                security_answer_hash=get_password_hash(u["role"]),
            )
        )
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
