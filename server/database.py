import os
from datetime import datetime, timedelta
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from server.models import Base, Tour, Guide, Schedule, Booking

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./museum_tours.db")
TESTING = os.getenv("TESTING", "false").lower() in ("true", "1", "yes")

if (
    TESTING
    or DATABASE_URL.startswith("sqlite:///:memory:")
    or DATABASE_URL == "sqlite://"
):
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
elif DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """Initialize database tables idempotently."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data(db: Session) -> None:
    """Seed initial sample museum data idempotently."""
    # Seed default Tours if not present
    existing_tours = db.query(Tour).count()
    if existing_tours == 0:
        tour1 = Tour(
            id="11111111-1111-1111-1111-111111111111",
            title="Renaissance Masterpieces & Mona Lisa",
            description="Explore the defining masterworks of the Italian Renaissance including Leonardo da Vinci's Mona Lisa.",
            duration_minutes=90,
        )
        tour2 = Tour(
            id="22222222-2222-2222-2222-222222222222",
            title="Ancient Egyptian Antiquities",
            description="Journey through the pharaonic dynasties, royal sarcophagi, and the Great Sphinx crypts.",
            duration_minutes=75,
        )
        tour3 = Tour(
            id="33333333-3333-3333-3333-333333333333",
            title="Impressionist Highlights & Sculpture Garden",
            description="Discover Monet, Degas, Rodin, and French modern art across open gallery wings.",
            duration_minutes=60,
        )
        db.add_all([tour1, tour2, tour3])
        db.commit()

    # Seed default Guides if not present
    existing_guides = db.query(Guide).count()
    if existing_guides == 0:
        guide1 = Guide(
            id="44444444-4444-4444-4444-444444444444",
            name="Jean-Luc Picard",
            email="jeanluc.picard@museum.org",
            specialization="Renaissance & Classical Art",
        )
        guide2 = Guide(
            id="55555555-5555-5555-5555-555555555555",
            name="Amelia Vance",
            email="amelia.vance@museum.org",
            specialization="Egyptology & Ancient Civilizations",
        )
        guide3 = Guide(
            id="66666666-6666-6666-6666-666666666666",
            name="Marcelle Dupuis",
            email="marcelle.dupuis@museum.org",
            specialization="19th Century French Impressionism",
        )
        db.add_all([guide1, guide2, guide3])
        db.commit()

    # Seed default Schedules if not present
    existing_schedules = db.query(Schedule).count()
    if existing_schedules == 0:
        now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
        s1 = Schedule(
            id="77777777-7777-7777-7777-777777777777",
            tour_id="11111111-1111-1111-1111-111111111111",
            guide_id="44444444-4444-4444-4444-444444444444",
            start_time=now + timedelta(hours=2),
            end_time=now + timedelta(hours=3, minutes=30),
            max_capacity=25,
            status="Published",
        )
        s2 = Schedule(
            id="88888888-8888-8888-8888-888888888888",
            tour_id="22222222-2222-2222-2222-222222222222",
            guide_id="55555555-5555-5555-5555-555555555555",
            start_time=now + timedelta(hours=4),
            end_time=now + timedelta(hours=5, minutes=15),
            max_capacity=20,
            status="Published",
        )
        s3 = Schedule(
            id="99999999-9999-9999-9999-999999999999",
            tour_id="33333333-3333-3333-3333-333333333333",
            guide_id="66666666-6666-6666-6666-666666666666",
            start_time=now + timedelta(hours=6),
            end_time=now + timedelta(hours=7),
            max_capacity=30,
            status="Published",
        )
        db.add_all([s1, s2, s3])
        db.commit()

        # Seed a sample booking for s1
        b1 = Booking(
            id="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            schedule_id="77777777-7777-7777-7777-777777777777",
            visitor_name="Alice Walker",
            visitor_email="alice.walker@example.com",
            ticket_quantity=2,
            booking_status="Confirmed",
        )
        db.add(b1)
        db.commit()
