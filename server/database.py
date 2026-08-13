import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server import models
    from server.auth import get_password_hash

    # Seed regular user
    user = db.query(models.User).filter(models.User.email == "test@example.com").first()
    if not user:
        user = models.User(
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            full_name="Test User",
            role="RENTER",
            is_active=True,
            is_verified=True,
        )
        db.add(user)

    # Seed admin user
    admin = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin:
        admin = models.User(
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Admin User",
            role="ADMIN",
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

    db.commit()

    # Seed initial equipment if empty
    equipment_count = db.query(models.Equipment).count()
    if equipment_count == 0:
        sample_items = [
            models.Equipment(
                name="Sony Alpha A7 IV Camera",
                category="CAMERAS",
                daily_rate=50.00,
                deposit_amount=100.00,
                status="AVAILABLE",
                specifications={
                    "resolution": "33MP",
                    "sensor": "Full Frame",
                    "4k_video": True,
                },
                version=1,
            ),
            models.Equipment(
                name="DJI Mavic 3 Pro Drone",
                category="DRONES",
                daily_rate=75.00,
                deposit_amount=200.00,
                status="AVAILABLE",
                specifications={
                    "resolution": "4K",
                    "flight_time": "43 mins",
                    "obstacle_avoidance": True,
                },
                version=1,
            ),
            models.Equipment(
                name="DeWalt Rotary Hammer Drill",
                category="CONSTRUCTION_TOOLS",
                daily_rate=35.00,
                deposit_amount=80.00,
                status="AVAILABLE",
                specifications={"power": "20V", "impact_energy": "2.1 Joules"},
                version=1,
            ),
            models.Equipment(
                name="Canon EOS R5 Camera",
                category="CAMERAS",
                daily_rate=65.00,
                deposit_amount=150.00,
                status="MAINTENANCE",
                specifications={"resolution": "45MP", "8k_video": True},
                version=1,
            ),
        ]
        db.add_all(sample_items)
        db.commit()
