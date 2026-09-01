import os
from datetime import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.models.parking import (
    Base,
    ParkingLocation,
    ParkingSpot,
    HourlyRate,
    SensorEvent,
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/parking.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(engine_override=None):
    target_engine = engine_override or engine
    Base.metadata.create_all(bind=target_engine)


def seed_data(db_session: Session = None):
    should_close = False
    if db_session is None:
        db_session = SessionLocal()
        should_close = True

    try:
        # Check if already seeded
        existing = db_session.query(ParkingLocation).first()
        if existing:
            return

        locations_data = [
            {
                "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
                "name": "Downtown Central Garage",
                "address": "123 Main St, San Francisco, CA 94105",
                "latitude": 37.7751,
                "longitude": -122.4180,
                "spot_type": "covered",
                "has_ev_charging": True,
                "total_capacity": 50,
                "available_spots": 12,
                "base_rate": 5.00,
                "peak_rate": 8.00,
                "max_daily": 35.00,
            },
            {
                "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
                "name": "Mission District Lot",
                "address": "789 Valencia St, San Francisco, CA 94110",
                "latitude": 37.7599,
                "longitude": -122.4215,
                "spot_type": "open_lot",
                "has_ev_charging": False,
                "total_capacity": 30,
                "available_spots": 5,
                "base_rate": 3.50,
                "peak_rate": 6.00,
                "max_daily": 25.00,
            },
            {
                "id": "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
                "name": "Union Square Underground Parking",
                "address": "333 Post St, San Francisco, CA 94108",
                "latitude": 37.7879,
                "longitude": -122.4075,
                "spot_type": "garage",
                "has_ev_charging": True,
                "total_capacity": 100,
                "available_spots": 45,
                "base_rate": 7.00,
                "peak_rate": 12.00,
                "max_daily": 45.00,
            },
            {
                "id": "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
                "name": "Embarcadero Pier Parking",
                "address": "1 Embarcadero Blvd, San Francisco, CA 94111",
                "latitude": 37.7955,
                "longitude": -122.3937,
                "spot_type": "covered",
                "has_ev_charging": True,
                "total_capacity": 80,
                "available_spots": 20,
                "base_rate": 6.00,
                "peak_rate": 10.00,
                "max_daily": 40.00,
            },
            {
                "id": "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
                "name": "SoMa Street Parking Bay",
                "address": "450 4th St, San Francisco, CA 94107",
                "latitude": 37.7812,
                "longitude": -122.3998,
                "spot_type": "street",
                "has_ev_charging": False,
                "total_capacity": 25,
                "available_spots": 0,
                "base_rate": 2.50,
                "peak_rate": 4.50,
                "max_daily": 20.00,
            },
        ]

        for loc_data in locations_data:
            loc = ParkingLocation(
                id=loc_data["id"],
                name=loc_data["name"],
                address=loc_data["address"],
                latitude=loc_data["latitude"],
                longitude=loc_data["longitude"],
                spot_type=loc_data["spot_type"],
                has_ev_charging=loc_data["has_ev_charging"],
                total_capacity=loc_data["total_capacity"],
                available_spots=loc_data["available_spots"],
            )
            db_session.add(loc)

            rate = HourlyRate(
                id=f"rate-{loc_data['id']}",
                location_id=loc_data["id"],
                base_rate_per_hour=loc_data["base_rate"],
                peak_rate_per_hour=loc_data["peak_rate"],
                peak_start_time=time(7, 0, 0),
                peak_end_time=time(19, 0, 0),
                max_daily_rate=loc_data["max_daily"],
            )
            db_session.add(rate)

            # Add sample spots
            for i in range(1, min(6, loc_data["total_capacity"] + 1)):
                spot_status = (
                    "AVAILABLE" if i <= loc_data["available_spots"] else "OCCUPIED"
                )
                spot = ParkingSpot(
                    id=f"spot-{loc_data['id'][:8]}-{i}",
                    location_id=loc_data["id"],
                    spot_number=f"A-{i:02d}",
                    status=spot_status,
                )
                db_session.add(spot)

        # Initial sample event
        sample_event = SensorEvent(
            spot_id="9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
            facility_name="Downtown Central Garage",
            status="AVAILABLE",
            available_spots=12,
            event_type="SPOT_STATUS_CHANGED",
        )
        db_session.add(sample_event)

        db_session.commit()
    except Exception as e:
        db_session.rollback()
        raise e
    finally:
        if should_close:
            db_session.close()
