import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

if DATABASE_URL.startswith("sqlite"):
    if ":memory:" in DATABASE_URL or os.getenv("TESTING", "").lower() in ("true", "1"):
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
        )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Idempotently initialize database tables."""
    # Import models so all tables are registered on Base.metadata
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """Idempotently seed default data."""
    from server.models import Tour, Guide
    from sqlalchemy.exc import IntegrityError

    # Seed default tours
    tours_data = [
        {
            "id": "e81d86d6-0c14-411d-85f0-82a0d9229864",
            "title": "Renaissance Art Highlights",
            "description": "Explore masterworks of the Italian Renaissance including Mona Lisa and Winged Victory.",
            "duration_minutes": 90,
        },
        {
            "id": "e81d86d6-0c14-411d-85f0-82a0d9229865",
            "title": "Ancient Egypt & Antiquities",
            "description": "Journey through pharaonic history, sphinxes, sarcophagi, and the Rosetta Stone.",
            "duration_minutes": 75,
        },
        {
            "id": "e81d86d6-0c14-411d-85f0-82a0d9229866",
            "title": "Impressionist Masterpieces",
            "description": "Discover iconic paintings by Monet, Renoir, Degas, and Van Gogh.",
            "duration_minutes": 60,
        },
    ]

    for t_data in tours_data:
        existing = db.query(Tour).filter(Tour.id == t_data["id"]).first()
        if not existing:
            tour = Tour(**t_data)
            db.add(tour)

    # Seed default guides
    guides_data = [
        {
            "id": "a11d86d6-0c14-411d-85f0-82a0d9229861",
            "name": "Alice Smith",
            "email": "alice.smith@museum.org",
            "specialization": "Renaissance Art & Sculpture",
        },
        {
            "id": "a11d86d6-0c14-411d-85f0-82a0d9229862",
            "name": "Bob Jones",
            "email": "bob.jones@museum.org",
            "specialization": "Ancient Civilizations & Egyptology",
        },
        {
            "id": "a11d86d6-0c14-411d-85f0-82a0d9229863",
            "name": "Catherine Dubois",
            "email": "catherine.dubois@museum.org",
            "specialization": "Impressionism & Modern Art",
        },
    ]

    for g_data in guides_data:
        existing = db.query(Guide).filter(Guide.email == g_data["email"]).first()
        if not existing:
            guide = Guide(**g_data)
            db.add(guide)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
