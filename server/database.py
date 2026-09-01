import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./parking.db")
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

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
    import server.models.parking  # noqa: F401
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models.parking import ParkingLocation, ParkingSpot, HourlyRate

    if db.query(ParkingLocation).first():
        return

    sample_locations = [
        {
            "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
            "name": "Downtown Central Garage",
            "address": "123 Main St, San Francisco, CA",
            "latitude": 37.7751,
            "longitude": -122.4180,
            "spot_type": "garage",
            "has_ev_charging": True,
            "total_capacity": 50,
            "base_rate": 5.00,
            "peak_rate": 8.00,
            "weekend_rate": 6.00,
            "max_daily_rate": 35.00,
            "available_count": 12,
        },
        {
            "id": "a2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
            "name": "Financial District Covered Parking",
            "address": "456 Market St, San Francisco, CA",
            "latitude": 37.7910,
            "longitude": -122.4010,
            "spot_type": "covered",
            "has_ev_charging": True,
            "total_capacity": 80,
            "base_rate": 7.50,
            "peak_rate": 12.00,
            "weekend_rate": 9.00,
            "max_daily_rate": 45.00,
            "available_count": 25,
        },
        {
            "id": "b3c4d5e6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
            "name": "Mission Open Lot",
            "address": "789 Mission St, San Francisco, CA",
            "latitude": 37.7840,
            "longitude": -122.4070,
            "spot_type": "open_lot",
            "has_ev_charging": False,
            "total_capacity": 40,
            "base_rate": 4.00,
            "peak_rate": 6.00,
            "weekend_rate": 5.00,
            "max_daily_rate": 25.00,
            "available_count": 18,
        },
        {
            "id": "c4d5e6f7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
            "name": "SOMA Street Parking Zone A",
            "address": "321 Folsom St, San Francisco, CA",
            "latitude": 37.7880,
            "longitude": -122.3950,
            "spot_type": "street",
            "has_ev_charging": False,
            "total_capacity": 20,
            "base_rate": 3.00,
            "peak_rate": 5.00,
            "weekend_rate": 3.00,
            "max_daily_rate": 20.00,
            "available_count": 5,
        },
        {
            "id": "d5e6f7a8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
            "name": "Union Square Underground Garage",
            "address": "333 Post St, San Francisco, CA",
            "latitude": 37.7885,
            "longitude": -122.4075,
            "spot_type": "garage",
            "has_ev_charging": True,
            "total_capacity": 100,
            "base_rate": 6.00,
            "peak_rate": 10.00,
            "weekend_rate": 8.00,
            "max_daily_rate": 40.00,
            "available_count": 0,
        },
    ]

    for loc_data in sample_locations:
        loc = ParkingLocation(
            id=loc_data["id"],
            name=loc_data["name"],
            address=loc_data["address"],
            latitude=loc_data["latitude"],
            longitude=loc_data["longitude"],
            spot_type=loc_data["spot_type"],
            has_ev_charging=loc_data["has_ev_charging"],
            total_capacity=loc_data["total_capacity"],
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(loc)

        rate = HourlyRate(
            id=str(uuid.uuid4()),
            location_id=loc_data["id"],
            base_rate_per_hour=loc_data["base_rate"],
            peak_rate_per_hour=loc_data["peak_rate"],
            weekend_rate_per_hour=loc_data["weekend_rate"],
            peak_start_time="07:00:00",
            peak_end_time="19:00:00",
            max_daily_rate=loc_data["max_daily_rate"],
            currency="USD",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(rate)

        # Create individual parking spots
        for i in range(1, loc_data["total_capacity"] + 1):
            is_avail = i <= loc_data["available_count"]
            spot = ParkingSpot(
                id=str(uuid.uuid4()),
                location_id=loc_data["id"],
                spot_number=f"S-{i:02d}",
                status="AVAILABLE" if is_avail else "OCCUPIED",
                last_status_change=datetime.now(timezone.utc),
            )
            db.add(spot)

    try:
        db.commit()
    except Exception:
        db.rollback()
