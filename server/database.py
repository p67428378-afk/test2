import os
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/museum_tours.db")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables idempotently."""
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """Seed initial museum data idempotently."""
    from server.models import Guide, Tour, Schedule

    # Check if tours exist
    if db.query(Tour).first():
        return

    # Seed Tours
    tours_data = [
        Tour(
            title="Renaissance Masterpieces",
            description="Explore the Mona Lisa, Winged Victory, and iconic Renaissance art.",
            duration_minutes=90,
        ),
        Tour(
            title="Ancient Egyptian Antiquities",
            description="Journey through the pharaohs, mummies, and hieroglyphic treasures.",
            duration_minutes=60,
        ),
        Tour(
            title="Modern & Contemporary Art",
            description="Discover avant-garde sculptures, impressions, and modern installations.",
            duration_minutes=75,
        ),
    ]
    for tour in tours_data:
        db.add(tour)
    db.commit()

    # Seed Guides
    guides_data = [
        Guide(
            name="Dr. Eleanor Vance",
            email="eleanor.vance@museum.org",
            specialization="Renaissance & Baroque Art",
        ),
        Guide(
            name="Marcus Holloway",
            email="marcus.holloway@museum.org",
            specialization="Ancient Civilizations",
        ),
        Guide(
            name="Sophie Dubois",
            email="sophie.dubois@museum.org",
            specialization="Modern Art & Sculpture",
        ),
    ]
    for guide in guides_data:
        db.add(guide)
    db.commit()

    # Seed Initial Schedules
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    tours = db.query(Tour).all()
    guides = db.query(Guide).all()

    if tours and guides:
        schedule1 = Schedule(
            tour_id=tours[0].id,
            guide_id=guides[0].id,
            start_time=now + timedelta(hours=2),
            end_time=now + timedelta(hours=3, minutes=30),
            max_capacity=25,
            status="Published",
        )
        schedule2 = Schedule(
            tour_id=tours[1].id,
            guide_id=guides[1].id,
            start_time=now + timedelta(hours=4),
            end_time=now + timedelta(hours=5),
            max_capacity=20,
            status="Published",
        )
        schedule3 = Schedule(
            tour_id=tours[2].id,
            guide_id=None,
            start_time=now + timedelta(hours=6),
            end_time=now + timedelta(hours=7, minutes=15),
            max_capacity=15,
            status="Draft",
        )
        db.add_all([schedule1, schedule2, schedule3])
        db.commit()
