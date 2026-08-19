import uuid
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from passlib.context import CryptContext
from server.config import settings

# SQLite setup handling thread checks and URL fixes
db_url = settings.DATABASE_URL
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import all models to ensure they register on Base.metadata
    from server.models import user, task, cost_log  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session = None):
    close_after = False
    if db is None:
        db = SessionLocal()
        close_after = True

    try:
        from server.models.user import User

        # Seed regular user
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                id=str(uuid.uuid4()),
                full_name="Test User",
                email="test@example.com",
                hashed_password=get_password_hash("testpassword"),
                role="Manager",
                is_active=True,
            )
            db.add(test_user)

        # Seed admin user
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                id=str(uuid.uuid4()),
                full_name="Admin User",
                email="admin@example.com",
                hashed_password=get_password_hash("adminpassword"),
                role="Admin",
                is_active=True,
            )
            db.add(admin_user)

        # Seed technician user
        tech_user = db.query(User).filter(User.email == "john.doe@eb.gov").first()
        if not tech_user:
            tech_user = User(
                id=str(uuid.uuid4()),
                full_name="John Doe",
                email="john.doe@eb.gov",
                hashed_password=get_password_hash("techpassword"),
                role="Technician",
                is_active=True,
            )
            db.add(tech_user)

        db.commit()
    except Exception:
        db.rollback()
    finally:
        if close_after:
            db.close()
