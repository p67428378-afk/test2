import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from server.config import settings

# For SQLite, we need connect_args={"check_same_thread": False}
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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    # Idempotent seeding of some default cities
    from server.models import City, SearchStatistics
    from datetime import datetime, timezone

    default_cities = [
        {
            "name": "Seattle",
            "state": "WA",
            "country": "US",
            "latitude": 47.6062,
            "longitude": -122.3321,
        },
        {
            "name": "New York",
            "state": "NY",
            "country": "US",
            "latitude": 40.7128,
            "longitude": -74.0060,
        },
        {
            "name": "London",
            "state": None,
            "country": "GB",
            "latitude": 51.5074,
            "longitude": -0.1278,
        },
        {
            "name": "Tokyo",
            "state": None,
            "country": "JP",
            "latitude": 35.6762,
            "longitude": 139.6503,
        },
    ]

    for city_data in default_cities:
        # Check if city already exists
        existing = (
            db.query(City)
            .filter(
                City.name == city_data["name"], City.country == city_data["country"]
            )
            .first()
        )
        if not existing:
            city = City(
                id=str(uuid.uuid4()),
                name=city_data["name"],
                state=city_data["state"],
                country=city_data["country"],
                latitude=city_data["latitude"],
                longitude=city_data["longitude"],
            )
            db.add(city)
            db.commit()
            db.refresh(city)

            # Add initial search statistic
            stats = SearchStatistics(
                id=str(uuid.uuid4()),
                city_id=city.id,
                search_count=1,
                last_searched_at=datetime.now(timezone.utc),
            )
            db.add(stats)
            db.commit()
