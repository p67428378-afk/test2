import os
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.models.parking import Base, User, ParkingLocation, ParkingSpot, HourlyRate

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/parking.db")

# For SQLite, enable check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    # 1. Seed Users (Idempotent)
    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "role": "user",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "role": "admin",
        },
    ]

    for u in users_to_seed:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            user = User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"],
                is_active=True,
                is_verified=True,
            )
            db.add(user)

    # 2. Seed Parking Facilities & Spots (Idempotent)
    locations_seed = [
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
            "base_rate": 5.0,
            "peak_rate": 8.0,
            "weekend_rate": 6.0,
            "max_daily": 35.0,
            "peak_start": "07:00:00",
            "peak_end": "19:00:00",
        },
        {
            "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
            "name": "Embarcadero Plaza Parking",
            "address": "1 Market St, San Francisco, CA 94105",
            "latitude": 37.7941,
            "longitude": -122.3952,
            "spot_type": "garage",
            "has_ev_charging": True,
            "total_capacity": 100,
            "available_spots": 45,
            "base_rate": 6.5,
            "peak_rate": 10.0,
            "weekend_rate": 7.5,
            "max_daily": 45.0,
            "peak_start": "08:00:00",
            "peak_end": "18:00:00",
        },
        {
            "id": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
            "name": "Mission District Open Lot",
            "address": "780 Valencia St, San Francisco, CA 94110",
            "latitude": 37.7600,
            "longitude": -122.4215,
            "spot_type": "open_lot",
            "has_ev_charging": False,
            "total_capacity": 30,
            "available_spots": 8,
            "base_rate": 3.5,
            "peak_rate": 5.0,
            "weekend_rate": 4.0,
            "max_daily": 25.0,
            "peak_start": "09:00:00",
            "peak_end": "20:00:00",
        },
        {
            "id": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
            "name": "Civic Center Underground Garage",
            "address": "355 McAllister St, San Francisco, CA 94102",
            "latitude": 37.7808,
            "longitude": -122.4172,
            "spot_type": "covered",
            "has_ev_charging": True,
            "total_capacity": 120,
            "available_spots": 0,
            "base_rate": 4.5,
            "peak_rate": 7.0,
            "weekend_rate": 5.0,
            "max_daily": 30.0,
            "peak_start": "07:00:00",
            "peak_end": "19:00:00",
        },
        {
            "id": "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
            "name": "Union Square Street Parking Zone B",
            "address": "333 Post St, San Francisco, CA 94108",
            "latitude": 37.7880,
            "longitude": -122.4075,
            "spot_type": "street",
            "has_ev_charging": False,
            "total_capacity": 20,
            "available_spots": 3,
            "base_rate": 4.0,
            "peak_rate": 6.5,
            "weekend_rate": 4.5,
            "max_daily": 28.0,
            "peak_start": "09:00:00",
            "peak_end": "18:00:00",
        },
        {
            "id": "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
            "name": "SoMa Tech Park Garage",
            "address": "500 Howard St, San Francisco, CA 94105",
            "latitude": 37.7878,
            "longitude": -122.3970,
            "spot_type": "garage",
            "has_ev_charging": True,
            "total_capacity": 80,
            "available_spots": 25,
            "base_rate": 7.0,
            "peak_rate": 12.0,
            "weekend_rate": 8.0,
            "max_daily": 50.0,
            "peak_start": "08:00:00",
            "peak_end": "18:00:00",
        },
    ]

    for loc_data in locations_seed:
        loc = (
            db.query(ParkingLocation)
            .filter(ParkingLocation.id == loc_data["id"])
            .first()
        )
        if not loc:
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
            db.add(loc)
            db.flush()

            rate = HourlyRate(
                location_id=loc.id,
                base_rate_per_hour=loc_data["base_rate"],
                peak_rate_per_hour=loc_data["peak_rate"],
                weekend_rate_per_hour=loc_data["weekend_rate"],
                max_daily_rate=loc_data["max_daily"],
                peak_start_time=loc_data["peak_start"],
                peak_end_time=loc_data["peak_end"],
            )
            db.add(rate)

            # Add some individual spot records
            for i in range(1, min(11, loc_data["total_capacity"] + 1)):
                spot_status = (
                    "AVAILABLE" if i <= loc_data["available_spots"] else "OCCUPIED"
                )
                spot = ParkingSpot(
                    location_id=loc.id,
                    spot_number=f"{loc_data['name'][:3].upper()}-{i:02d}",
                    status=spot_status,
                )
                db.add(spot)

    db.commit()
