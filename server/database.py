from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.config import settings

# For SQLite, we need to allow multi-threaded access
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

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
    """Initialize the database schema."""
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    """Seed initial data (users, plot types) idempotently."""
    from server.models import User, PlotType
    from server.auth import get_password_hash

    # Seed Users
    users_to_seed = [
        {"username": "test@example.com", "password": "testpassword", "role": "user"},
        {"username": "admin@example.com", "password": "adminpassword", "role": "admin"},
    ]

    for u_data in users_to_seed:
        existing_user = (
            db.query(User).filter(User.username == u_data["username"]).first()
        )
        if not existing_user:
            try:
                db_user = User(
                    username=u_data["username"],
                    hashed_password=get_password_hash(u_data["password"]),
                    role=u_data["role"],
                )
                db.add(db_user)
                db.commit()
            except Exception:
                db.rollback()

    # Seed Plot Types
    plot_types_to_seed = [
        {"name": "Single Plot", "description": "A standard single burial plot."},
        {
            "name": "Companion Plot",
            "description": "A double burial plot for two individuals side-by-side or double-depth.",
        },
        {
            "name": "Family Plot (Estate)",
            "description": "A larger designated area for multiple family members.",
        },
        {
            "name": "Cremation Niche",
            "description": "An above-ground space in a columbarium for an urn.",
        },
        {
            "name": "Mausoleum Crypt",
            "description": "An above-ground space in a mausoleum for a casket.",
        },
        {
            "name": "Urn Garden",
            "description": "A landscaped garden area specifically for burying cremated remains.",
        },
    ]

    for pt_data in plot_types_to_seed:
        existing_pt = (
            db.query(PlotType).filter(PlotType.name == pt_data["name"]).first()
        )
        if not existing_pt:
            try:
                db_pt = PlotType(
                    name=pt_data["name"], description=pt_data["description"]
                )
                db.add(db_pt)
                db.commit()
            except Exception:
                db.rollback()
