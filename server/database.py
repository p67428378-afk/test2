import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./weather.db")

# Create engine with appropriate SQLite args if applicable
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields an open database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None) -> None:
    """Initialize database tables idempotently."""
    # Import all models to ensure they are registered on Base.metadata
    from server.models import location, search_history  # noqa: F401

    db_engine = target_engine or engine
    Base.metadata.create_all(bind=db_engine)


def seed_data(db: Session) -> None:
    """Seed initial known locations and test records idempotently."""
    from server.models.location import CachedLocation

    default_locations = [
        {
            "id": "loc-ny-001",
            "name": "New York",
            "region": "New York",
            "country": "United States",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "zip_code": "10001",
        },
        {
            "id": "loc-lon-002",
            "name": "London",
            "region": "England",
            "country": "United Kingdom",
            "latitude": 51.5074,
            "longitude": -0.1278,
            "zip_code": "EC1A",
        },
        {
            "id": "loc-tok-003",
            "name": "Tokyo",
            "region": "Tokyo",
            "country": "Japan",
            "latitude": 35.6762,
            "longitude": 139.6503,
            "zip_code": "100-0001",
        },
        {
            "id": "loc-sf-004",
            "name": "San Francisco",
            "region": "California",
            "country": "United States",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "zip_code": "94102",
        },
        {
            "id": "loc-chi-005",
            "name": "Chicago",
            "region": "Illinois",
            "country": "United States",
            "latitude": 41.8781,
            "longitude": -87.6298,
            "zip_code": "60601",
        },
        {
            "id": "loc-par-006",
            "name": "Paris",
            "region": "Ile-de-France",
            "country": "France",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "zip_code": "75001",
        },
    ]

    for loc_data in default_locations:
        existing = (
            db.query(CachedLocation)
            .filter(
                (CachedLocation.name == loc_data["name"])
                | (CachedLocation.id == loc_data["id"])
            )
            .first()
        )
        if not existing:
            new_loc = CachedLocation(
                id=loc_data["id"],
                name=loc_data["name"],
                region=loc_data["region"],
                country=loc_data["country"],
                latitude=loc_data["latitude"],
                longitude=loc_data["longitude"],
                zip_code=loc_data["zip_code"],
            )
            db.add(new_loc)
    try:
        db.commit()
    except Exception:
        db.rollback()
