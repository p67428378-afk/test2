import os
import uuid
from datetime import datetime, date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

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


def seed_data(db: Session):
    from server.models import (
        Apiary,
        Hive,
        TelemetryLog,
        HoneyHarvest,
        DiseaseReport,
        Inspection,
    )

    # Check if apiaries already exist
    if db.query(Apiary).first() is None:
        default_apiary = Apiary(
            id=str(uuid.uuid4()),
            name="Sunny Valley Apiary",
            location="North Ridge, Plot 4B",
            notes="Main commercial apiary with high wildflower density.",
        )
        db.add(default_apiary)
        db.commit()
        db.refresh(default_apiary)

        hive1 = Hive(
            id=str(uuid.uuid4()),
            apiary_id=default_apiary.id,
            hive_number="HIVE-01",
            queen_breed="Italian Honeybee (Apis mellifera ligustica)",
            status="active",
            estimated_population=45000,
        )
        hive2 = Hive(
            id=str(uuid.uuid4()),
            apiary_id=default_apiary.id,
            hive_number="HIVE-02",
            queen_breed="Carniolan (Apis mellifera carnica)",
            status="active",
            estimated_population=38000,
        )
        db.add_all([hive1, hive2])
        db.commit()
        db.refresh(hive1)
        db.refresh(hive2)

        # Seed Telemetry for Hive 1
        now = datetime.utcnow()
        for i in range(5):
            t_log = TelemetryLog(
                id=str(uuid.uuid4()),
                hive_id=hive1.id,
                temperature_celsius=34.2 + (i * 0.2),
                humidity_percent=58.5 + (i * 0.5),
                weight_kg=42.0 + (i * 0.1),
                recorded_at=now - timedelta(hours=(5 - i)),
            )
            db.add(t_log)

        # Seed Harvest for Hive 1
        harvest1 = HoneyHarvest(
            id=str(uuid.uuid4()),
            hive_id=hive1.id,
            harvest_date=date.today() - timedelta(days=30),
            quantity_kg=24.5,
            honey_type="Wildflower",
            moisture_content_percent=17.2,
        )
        db.add(harvest1)

        # Seed Disease Report for Hive 2
        disease1 = DiseaseReport(
            id=str(uuid.uuid4()),
            hive_id=hive2.id,
            disease_name="Varroa Mites",
            severity_level="Medium",
            symptoms_description="Moderate mite drop counted during bottom board sticky board check.",
            treatment_applied="Oxalic acid vapor treatment scheduled.",
            report_date=now - timedelta(days=2),
        )
        db.add(disease1)

        # Seed Inspection for Hive 1
        inspection1 = Inspection(
            id=str(uuid.uuid4()),
            hive_id=hive1.id,
            scheduled_date=now + timedelta(days=3),
            inspector_name="John Beekeeper",
            status="scheduled",
            notes="Routine frame inspection and queen spot check.",
        )
        db.add(inspection1)

        db.commit()


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
