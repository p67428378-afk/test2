"""Database configuration, session management, and initial data seeding."""

import os
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./museum_tours.db")

connect_args = {}
engine_kwargs = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    if ":memory:" in DATABASE_URL or DATABASE_URL == "sqlite://":
        engine_kwargs["poolclass"] = StaticPool

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that provides an independent database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(engine_to_use=None):
    """Create all database tables."""
    from server import models  # Ensure all models are registered on Base.metadata
    target_engine = engine_to_use if engine_to_use is not None else engine
    Base.metadata.create_all(bind=target_engine)


def seed_data(db: Session):
    """Seed sample museum tours, guides, and schedules idempotently."""
    from server.models import Tour, Guide, Schedule

    try:
        # Check if tours exist
        existing_tour = db.query(Tour).first()
        if not existing_tour:
            tour1 = Tour(
                id="tour-101",
                title="Renaissance Masterpieces",
                description="Explore iconic Renaissance paintings and sculptures including the Mona Lisa and Venus de Milo.",
                duration_minutes=90,
            )
            tour2 = Tour(
                id="tour-102",
                title="Ancient Egyptian Antiquities",
                description="Discover royal mummies, sphinxes, sarcophagi, and the mysteries of the Nile.",
                duration_minutes=60,
            )
            tour3 = Tour(
                id="tour-103",
                title="Impressionist & Modern Highlights",
                description="A guided journey through 19th and 20th century masterpieces by Monet, Degas, and Van Gogh.",
                duration_minutes=75,
            )
            db.add_all([tour1, tour2, tour3])
            db.commit()

        # Check if guides exist
        existing_guide = db.query(Guide).first()
        if not existing_guide:
            guide1 = Guide(
                id="guide-201",
                name="Dr. Alice Moreau",
                email="alice.moreau@louvre-museum.org",
                specialization="Italian Renaissance & Sculpture",
            )
            guide2 = Guide(
                id="guide-202",
                name="Prof. David Chen",
                email="david.chen@louvre-museum.org",
                specialization="Ancient Egyptian & Near East Antiquities",
            )
            guide3 = Guide(
                id="guide-203",
                name="Elena Rostova",
                email="elena.rostova@louvre-museum.org",
                specialization="19th Century French Impressionism",
            )
            db.add_all([guide1, guide2, guide3])
            db.commit()

        # Check if schedules exist
        existing_schedule = db.query(Schedule).first()
        if not existing_schedule:
            now = datetime.now(timezone.utc)
            base_date = now.replace(minute=0, second=0, microsecond=0) + timedelta(days=1)
            
            sched1 = Schedule(
                id="sched-301",
                tour_id="tour-101",
                guide_id="guide-201",
                start_time=base_date.replace(hour=10),
                end_time=base_date.replace(hour=11, minute=30),
                max_capacity=25,
                status="Published",
            )
            sched2 = Schedule(
                id="sched-302",
                tour_id="tour-102",
                guide_id="guide-202",
                start_time=base_date.replace(hour=14),
                end_time=base_date.replace(hour=15),
                max_capacity=20,
                status="Published",
            )
            sched3 = Schedule(
                id="sched-303",
                tour_id="tour-103",
                guide_id="guide-203",
                start_time=base_date.replace(hour=16),
                end_time=base_date.replace(hour=17, minute=15),
                max_capacity=30,
                status="Published",
            )
            db.add_all([sched1, sched2, sched3])
            db.commit()

    except Exception:
        db.rollback()
