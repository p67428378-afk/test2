from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.config import settings
from server.models import Base, User, Tag

# Support SQLite check_same_thread if using sqlite
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data(db):
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Seed test employee user
    try:
        emp = db.query(User).filter(User.email == "test@example.com").first()
        if not emp:
            emp = User(
                email="test@example.com",
                full_name="Regular Employee",
                hashed_password=pwd_context.hash("testpassword"),
                role="ROLE_EMPLOYEE",
                is_active=True,
                is_verified=True,
            )
            db.add(emp)

        # Seed expert user
        exp = db.query(User).filter(User.email == "admin@example.com").first()
        if not exp:
            exp = User(
                email="admin@example.com",
                full_name="Expert Reviewer",
                hashed_password=pwd_context.hash("adminpassword"),
                role="ROLE_EXPERT",
                is_active=True,
                is_verified=True,
            )
            db.add(exp)

        # Seed default tags
        initial_tags = [
            "Redis",
            "Performance",
            "Architecture",
            "Security",
            "DevOps",
            "Database",
            "Frontend",
        ]
        for tag_name in initial_tags:
            existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not existing_tag:
                db.add(Tag(name=tag_name))

        db.commit()
    except Exception:
        db.rollback()


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
