import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/wifi_tracker.db")

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
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import MaintenanceEvent

    if db.query(MaintenanceEvent).first() is None:
        sample_events = [
            MaintenanceEvent(
                id=str(uuid.uuid4()),
                title="Scheduled Router Replacement",
                event_date=datetime(2026, 5, 1, 10, 0, 0, tzinfo=timezone.utc),
                location="Building A - 2nd Floor",
                maintenance_type="Hardware Replacement",
                vendor_technician="NetTech Solutions",
                cost=800.00,
                description="Replaced core router with upgraded model due to high latency.",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            MaintenanceEvent(
                id=str(uuid.uuid4()),
                title="Firmware Upgrade & Tuning",
                event_date=datetime(2026, 5, 10, 14, 30, 0, tzinfo=timezone.utc),
                location="Building A - 2nd Floor",
                maintenance_type="Scheduled",
                vendor_technician="In-House Admin",
                cost=450.00,
                description="Updated AP firmware to v3.4.1 and optimized channel allocations.",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            MaintenanceEvent(
                id=str(uuid.uuid4()),
                title="Emergency Cable Repair",
                event_date=datetime(2026, 4, 15, 9, 0, 0, tzinfo=timezone.utc),
                location="Building B - West Wing",
                maintenance_type="Urgent Repair",
                vendor_technician="NetTech Solutions",
                cost=350.00,
                description="Repaired damaged ethernet drops near server rack.",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
        ]
        db.add_all(sample_events)
        db.commit()
