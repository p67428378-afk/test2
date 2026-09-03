"""Database configuration, engine, and seeding routines for Aura Photography Studio."""

import os
from datetime import datetime, timedelta
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker

from server.models import (
    AddOn,
    Availability,
    Base,
    ExtendedFeature,
    Package,
    Payment,
    Photographer,
    PhotoshootRecord,
    Session,
    User,
)


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/aura_studio.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all database tables idempotently."""
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """Seed initial studio data idempotently."""
    try:
        # 1. Seed Users
        users_to_seed = [
            {
                "email": "test@example.com",
                "password": "testpassword",
                "full_name": "Samantha Reed",
                "role": "Customer",
            },
            {
                "email": "admin@example.com",
                "password": "adminpassword",
                "full_name": "Studio Admin",
                "role": "Admin",
            },
            {
                "email": "photographer@example.com",
                "password": "photopassword",
                "full_name": "Elena Rostova",
                "role": "Photographer",
            },
            {
                "email": "marcus@example.com",
                "password": "photopassword",
                "full_name": "Marcus Vance",
                "role": "Photographer",
            },
        ]

        seeded_users = {}
        for u in users_to_seed:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                new_user = User(
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True,
                    is_verified=True,
                )
                db.add(new_user)
                db.flush()
                seeded_users[u["email"]] = new_user
            else:
                seeded_users[u["email"]] = existing

        # 2. Seed Photographers
        photogs_to_seed = [
            {
                "email": "photographer@example.com",
                "bio": "Specializing in timeless wedding, fine art, and portrait photography with over 10 years of editorial experience.",
                "specialization": "Portrait & Wedding Specialist",
            },
            {
                "email": "marcus@example.com",
                "bio": "Commercial, fashion, and lifestyle photographer with high-energy studio lighting expertise.",
                "specialization": "Commercial & Fashion Specialist",
            },
        ]

        seeded_photographers = {}
        for p in photogs_to_seed:
            user = seeded_users.get(p["email"])
            if user:
                existing_p = (
                    db.query(Photographer)
                    .filter(Photographer.user_id == user.id)
                    .first()
                )
                if not existing_p:
                    new_p = Photographer(
                        user_id=user.id,
                        bio=p["bio"],
                        specialization=p["specialization"],
                        is_active=True,
                    )
                    db.add(new_p)
                    db.flush()
                    seeded_photographers[p["email"]] = new_p
                else:
                    seeded_photographers[p["email"]] = existing_p

        # 3. Seed Availability for Elena Rostova
        elena = seeded_photographers.get("photographer@example.com")
        if elena:
            existing_avail = (
                db.query(Availability)
                .filter(Availability.photographer_id == elena.id)
                .first()
            )
            if not existing_avail:
                for day in range(1, 6):  # Mon-Fri
                    db.add(
                        Availability(
                            photographer_id=elena.id,
                            day_of_week=day,
                            start_time="09:00",
                            end_time="17:00",
                            is_blocked=False,
                        )
                    )
                # Add sample blocked date
                db.add(
                    Availability(
                        photographer_id=elena.id,
                        blocked_date="2026-06-21",
                        block_reason="Personal leave / Studio Maintenance",
                        is_blocked=True,
                    )
                )

        # 4. Seed Packages
        packages_to_seed = [
            {
                "name": "Wedding Package",
                "description": "Comprehensive wedding celebration coverage with high-end editorial editing.",
                "price": 1200.00,
                "duration_minutes": 360,
                "deliverables_summary": "6 hrs coverage • 100 edited photos • Online gallery",
            },
            {
                "name": "Portrait Package",
                "description": "Individual or headshot portrait session in studio or natural light.",
                "price": 350.00,
                "duration_minutes": 60,
                "deliverables_summary": "1 hr coverage • 15 edited photos",
            },
            {
                "name": "Family Session",
                "description": "Relaxed family and group photography session outdoors or in studio.",
                "price": 500.00,
                "duration_minutes": 120,
                "deliverables_summary": "2 hrs coverage • 35 edited photos",
            },
            {
                "name": "Commercial Branding",
                "description": "Product and brand marketing session with high-resolution commercial licensing.",
                "price": 750.00,
                "duration_minutes": 180,
                "deliverables_summary": "3 hrs coverage • 50 edited photos",
            },
        ]

        seeded_packages = {}
        for pkg in packages_to_seed:
            existing_pkg = db.query(Package).filter(Package.name == pkg["name"]).first()
            if not existing_pkg:
                new_pkg = Package(**pkg)
                db.add(new_pkg)
                db.flush()
                seeded_packages[pkg["name"]] = new_pkg
            else:
                seeded_packages[pkg["name"]] = existing_pkg

        # 5. Seed AddOns
        addons_to_seed = [
            {
                "name": "Drone Aerial Photography",
                "description": "High-resolution 4K aerial drone shots for outdoor and venue aesthetics.",
                "price": 250.00,
            },
            {
                "name": "Express 48-Hour Proofing Delivery",
                "description": "Expedited editing and proof gallery turnaround within 48 hours.",
                "price": 150.00,
            },
            {
                "name": "Hardcover Deluxe Photo Album",
                "description": "Custom bound 30-page heirloom photo album with archival luster finish.",
                "price": 300.00,
            },
        ]

        for add in addons_to_seed:
            existing_add = db.query(AddOn).filter(AddOn.name == add["name"]).first()
            if not existing_add:
                db.add(AddOn(**add))

        # 6. Seed Sample Session #104
        samantha = seeded_users.get("test@example.com")
        wedding_pkg = seeded_packages.get("Wedding Package")
        if samantha and elena and wedding_pkg:
            existing_session = (
                db.query(Session).filter(Session.customer_id == samantha.id).first()
            )
            if not existing_session:
                sample_session = Session(
                    customer_id=samantha.id,
                    photographer_id=elena.id,
                    package_id=wedding_pkg.id,
                    start_time=datetime(2026, 6, 20, 14, 0, 0),
                    end_time=datetime(2026, 6, 20, 20, 0, 0),
                    event_notes="Outdoor garden wedding portrait shoot in studio garden.",
                    total_price=1750.00,
                    deposit_amount=875.00,
                    status="in_progress",
                    hold_expires_at=datetime.utcnow() + timedelta(days=30),
                )
                db.add(sample_session)
                db.flush()

                # Seed Deposit Payment
                deposit_payment = Payment(
                    session_id=sample_session.id,
                    amount=875.00,
                    payment_method="credit_card",
                    payment_status="Partial",
                    transaction_reference="TXN-SAMPLE-104",
                )
                db.add(deposit_payment)

                # Seed Photoshoot Record
                photoshoot_rec = PhotoshootRecord(
                    session_id=sample_session.id,
                    gallery_url="https://gallery.aurastudio.com/proofs/104-wedding",
                    notes="Outdoor garden shoot finished successfully at sunset. 120 raw proofs uploaded.",
                    is_completed=False,
                    unpaid_balance_warning=True,
                )
                db.add(photoshoot_rec)

        # 7. Seed Extended Feature
        existing_feat = (
            db.query(ExtendedFeature)
            .filter(ExtendedFeature.feature_name == "Aura Live Gallery Sync")
            .first()
        )
        if not existing_feat:
            db.add(
                ExtendedFeature(
                    feature_name="Aura Live Gallery Sync",
                    configuration='{"auto_sync": true, "resolution": "4K", "watermark": true}',
                    status="Active",
                )
            )

        db.commit()
    except IntegrityError:
        db.rollback()
    except Exception as e:
        db.rollback()
        print(f"Seed warning: {e}")
