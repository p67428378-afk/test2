import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./prison_visitor.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool if ":memory:" in DATABASE_URL else None,
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

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
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server import models
    from server.auth import get_password_hash

    # 1. Seed Users (idempotent)
    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "role": "visitor",
            "full_name": "Test Visitor",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "role": "admin",
            "full_name": "Security Admin",
        },
        {
            "email": "officer@example.com",
            "password": "officerpassword",
            "role": "officer",
            "full_name": "Officer Johnson",
        },
    ]

    for user_data in users_to_seed:
        existing = (
            db.query(models.User)
            .filter(models.User.email == user_data["email"])
            .first()
        )
        if not existing:
            new_user = models.User(
                id=str(uuid.uuid4()),
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                full_name=user_data["full_name"],
                role=user_data["role"],
                is_active=True,
                is_verified=True,
            )
            db.add(new_user)
            try:
                db.commit()
            except Exception:
                db.rollback()

    # 2. Seed Sample Inmates (idempotent)
    sample_inmates = [
        {
            "inmate_number": "INV-404",
            "full_name": "John Smith",
            "cell_location": "Block C - Cell 102",
            "security_level": "MEDIUM",
            "weekly_visit_limit": 2,
            "status": "ACTIVE",
        },
        {
            "inmate_number": "INV-501",
            "full_name": "Robert Davis",
            "cell_location": "Block A - Cell 204",
            "security_level": "HIGH",
            "weekly_visit_limit": 2,
            "status": "ACTIVE",
        },
        {
            "inmate_number": "INV-602",
            "full_name": "Michael Brown",
            "cell_location": "Block B - Cell 301",
            "security_level": "MAXIMUM",
            "weekly_visit_limit": 1,
            "status": "ACTIVE",
        },
    ]

    for inmate_data in sample_inmates:
        existing = (
            db.query(models.Inmate)
            .filter(models.Inmate.inmate_number == inmate_data["inmate_number"])
            .first()
        )
        if not existing:
            new_inmate = models.Inmate(
                id=str(uuid.uuid4()),
                inmate_number=inmate_data["inmate_number"],
                full_name=inmate_data["full_name"],
                cell_location=inmate_data["cell_location"],
                security_level=inmate_data["security_level"],
                weekly_visit_limit=inmate_data["weekly_visit_limit"],
                status=inmate_data["status"],
            )
            db.add(new_inmate)
            try:
                db.commit()
            except Exception:
                db.rollback()

    # 3. Seed Sample Watchlist Entry (idempotent)
    sample_watchlist = [
        {
            "national_id": "BANNED-9999",
            "full_name": "Mark Criminal",
            "reason": "Previous contraband smuggling attempt",
            "severity_level": "CRITICAL",
            "flagged_by": str(uuid.uuid4()),
            "is_active": True,
        }
    ]

    for wl_data in sample_watchlist:
        existing = (
            db.query(models.WatchlistEntry)
            .filter(models.WatchlistEntry.national_id == wl_data["national_id"])
            .first()
        )
        if not existing:
            new_wl = models.WatchlistEntry(
                id=str(uuid.uuid4()),
                national_id=wl_data["national_id"],
                full_name=wl_data["full_name"],
                reason=wl_data["reason"],
                severity_level=wl_data["severity_level"],
                flagged_by=wl_data["flagged_by"],
                is_active=wl_data["is_active"],
            )
            db.add(new_wl)
            try:
                db.commit()
            except Exception:
                db.rollback()
