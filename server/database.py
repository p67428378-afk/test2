from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from server.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models here to register them on Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    # Seed initial data if needed (idempotent)
    from server.models import Equipment, Crew
    import uuid

    # Seed equipment
    default_equip = [
        {
            "name": "CTD Profiler",
            "serial_number": "CTD-9921",
            "status": "Operational",
            "location": "Deck A",
        },
        {
            "name": "Acoustic Doppler Current Profiler",
            "serial_number": "ADCP-4412",
            "status": "Needs Maintenance",
            "location": "Hull",
        },
        {
            "name": "Deep Sea Corer",
            "serial_number": "DSC-1029",
            "status": "In Repair",
            "location": "Storage Room B",
        },
    ]
    for eq in default_equip:
        existing = (
            db.query(Equipment)
            .filter(Equipment.serial_number == eq["serial_number"])
            .first()
        )
        if not existing:
            new_eq = Equipment(
                id=uuid.uuid4(),
                name=eq["name"],
                serial_number=eq["serial_number"],
                status=eq["status"],
                location=eq["location"],
            )
            db.add(new_eq)

    # Seed crew
    default_crew = [
        {
            "first_name": "Helen",
            "last_name": "Vance",
            "certification": "Chief Scientist",
        },
        {
            "first_name": "John",
            "last_name": "Doe",
            "certification": "Marine Engineer",
        },
    ]
    for cr in default_crew:
        existing = (
            db.query(Crew)
            .filter(
                Crew.first_name == cr["first_name"], Crew.last_name == cr["last_name"]
            )
            .first()
        )
        if not existing:
            new_cr = Crew(
                id=uuid.uuid4(),
                first_name=cr["first_name"],
                last_name=cr["last_name"],
                certification=cr["certification"],
            )
            db.add(new_cr)

    try:
        db.commit()
    except Exception:
        db.rollback()
