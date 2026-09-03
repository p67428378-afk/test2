import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./parking.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    """Create all database tables idempotently."""
    eng = target_engine or engine
    # Import all models to ensure they are registered with Base.metadata
    from server.models import category, parking  # noqa: F401

    Base.metadata.create_all(bind=eng)


def seed_data(db_session=None):
    """Seed initial data idempotently (categories, sample parking spots, etc.)."""
    from server.models.category import Category
    from server.models.parking import ParkingLocation, HourlyRate, ParkingSpot

    should_close = False
    if db_session is None:
        db = SessionLocal()
        should_close = True
    else:
        db = db_session

    try:
        # 1. Seed Categories (Car, Bike)
        default_categories = ["Bike", "Car", "Truck", "EV"]
        for cat_name in default_categories:
            existing = (
                db.query(Category)
                .filter(Category.name.ilike(cat_name))
                .first()
            )
            if not existing:
                cat = Category(
                    id=str(uuid.uuid4()),
                    name=cat_name,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                db.add(cat)

        # 2. Seed Sample Parking Locations if none exist
        existing_loc = db.query(ParkingLocation).first()
        if not existing_loc:
            loc1_id = "11111111-1111-4111-8111-111111111111"
            loc1 = ParkingLocation(
                id=loc1_id,
                name="Downtown Central Garage",
                address="123 Main St, San Francisco, CA 94105",
                latitude=37.789,
                longitude=-122.401,
                spot_type="garage",
                category="Car",
                has_ev_charging=True,
                total_capacity=50,
                available_spots=12,
                status="available",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            rate1 = HourlyRate(
                id=str(uuid.uuid4()),
                location_id=loc1_id,
                base_rate_per_hour=5.00,
                peak_rate_per_hour=8.00,
                off_peak_rate_per_hour=3.50,
                weekend_rate_per_hour=4.00,
                max_daily_rate=35.00,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )

            loc2_id = "22222222-2222-4222-8222-222222222222"
            loc2 = ParkingLocation(
                id=loc2_id,
                name="Market St Bike Locker & Hub",
                address="456 Market St, San Francisco, CA 94105",
                latitude=37.791,
                longitude=-122.399,
                spot_type="covered",
                category="Bike",
                has_ev_charging=True,
                total_capacity=30,
                available_spots=20,
                status="available",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            rate2 = HourlyRate(
                id=str(uuid.uuid4()),
                location_id=loc2_id,
                base_rate_per_hour=1.50,
                peak_rate_per_hour=2.50,
                off_peak_rate_per_hour=1.00,
                weekend_rate_per_hour=1.00,
                max_daily_rate=10.00,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )

            db.add_all([loc1, rate1, loc2, rate2])

            # Add sample spots
            for i in range(1, 6):
                spot = ParkingSpot(
                    id=str(uuid.uuid4()),
                    location_id=loc1_id,
                    spot_number=f"A-{i:02d}",
                    status="available" if i <= 3 else "occupied",
                    category="Car",
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc),
                )
                db.add(spot)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        if should_close:
            db.close()
