import os
from datetime import datetime, timezone
import uuid
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./studio.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User, Photographer, Package, Availability

    # Seed Customer User
    customer = db.query(User).filter(User.email == "test@example.com").first()
    if not customer:
        customer = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            password_hash=hash_password("testpassword"),
            full_name="Test Customer",
            role="customer",
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

    # Seed Admin User
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            password_hash=hash_password("adminpassword"),
            full_name="Studio Admin",
            role="admin",
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # Seed Photographer User & Profile
    photographer_user = (
        db.query(User).filter(User.email == "photographer@example.com").first()
    )
    if not photographer_user:
        photographer_user = User(
            id="11111111-1111-1111-1111-111111111111",
            email="photographer@example.com",
            password_hash=hash_password("photographerpassword"),
            full_name="Elena Rostova",
            role="photographer",
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(photographer_user)
        db.commit()
        db.refresh(photographer_user)

    photographer_profile = (
        db.query(Photographer)
        .filter(Photographer.user_id == photographer_user.id)
        .first()
    )
    if not photographer_profile:
        photographer_profile = Photographer(
            id="22222222-2222-2222-2222-222222222222",
            user_id=photographer_user.id,
            bio="Lead portrait and wedding photographer with 10+ years of fine art studio experience.",
            specialties="Weddings, Portraits, Commercial, Editorial",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(photographer_profile)
        db.commit()
        db.refresh(photographer_profile)

        # Add default availability (Mon-Fri 09:00 - 17:00, Sat 10:00 - 16:00)
        for day in range(0, 5):
            avail = Availability(
                id=str(uuid.uuid4()),
                photographer_id=photographer_profile.id,
                day_of_week=day,
                start_time="09:00",
                end_time="17:00",
                is_blocked=False,
                reason=None,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(avail)
        sat_avail = Availability(
            id=str(uuid.uuid4()),
            photographer_id=photographer_profile.id,
            day_of_week=5,
            start_time="10:00",
            end_time="16:00",
            is_blocked=False,
            reason=None,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(sat_avail)
        db.commit()

    # Seed Default Packages
    packages_data = [
        {
            "id": "33333333-3333-3333-3333-333333333331",
            "name": "Portrait Package",
            "description": "Individual or couple portrait session in studio or on location.",
            "duration_minutes": 60,
            "price": 350.00,
            "deliverables_summary": "1 hr coverage • 15 edited photos • High-res digital gallery",
        },
        {
            "id": "33333333-3333-3333-3333-333333333332",
            "name": "Wedding Package",
            "description": "Comprehensive wedding day coverage capturing memorable milestones.",
            "duration_minutes": 360,
            "price": 1200.00,
            "deliverables_summary": "6 hrs coverage • 100 edited photos • Digital delivery & album",
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "name": "Commercial Package",
            "description": "Brand, product, and corporate editorial photography session.",
            "duration_minutes": 180,
            "price": 750.00,
            "deliverables_summary": "3 hrs coverage • 50 edited photos • Commercial usage rights",
        },
        {
            "id": "33333333-3333-3333-3333-333333333334",
            "name": "Family Package",
            "description": "Heartwarming family portrait session in natural light or studio backdrop.",
            "duration_minutes": 90,
            "price": 450.00,
            "deliverables_summary": "1.5 hrs coverage • 25 edited photos • Print release",
        },
    ]

    for p in packages_data:
        existing_pkg = db.query(Package).filter(Package.name == p["name"]).first()
        if not existing_pkg:
            pkg = Package(
                id=p["id"],
                name=p["name"],
                description=p["description"],
                duration_minutes=p["duration_minutes"],
                price=p["price"],
                deliverables_summary=p["deliverables_summary"],
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(pkg)
    db.commit()
