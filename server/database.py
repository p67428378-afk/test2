import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./conference.db")

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
    # Import all models to ensure they register on Base.metadata
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models.user import User
    from server.auth.jwt import get_password_hash
    from sqlalchemy.exc import IntegrityError

    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test Attendee",
            "role": "ATTENDEE",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin Organizer",
            "role": "ORGANIZER",
        },
        {
            "email": "speaker@example.com",
            "password": "speakerpassword",
            "full_name": "Dr. Jane Speaker",
            "role": "SPEAKER",
        },
        {
            "email": "reviewer@example.com",
            "password": "reviewerpassword",
            "full_name": "Prof. John Reviewer",
            "role": "REVIEWER",
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            hashed = get_password_hash(u_data["password"])
            user = User(
                email=u_data["email"],
                hashed_password=hashed,
                full_name=u_data["full_name"],
                role=u_data["role"],
                is_active=True,
            )
            try:
                db.add(user)
                db.commit()
            except IntegrityError:
                db.rollback()
