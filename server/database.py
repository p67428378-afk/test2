import os
import uuid
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./festival.db")

# SQLite check for thread isolation
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

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
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    # Import models here to avoid circular imports
    from server.models import Stage, Artist, Ticket, Volunteer, VolunteerShift

    # Check if stages already exist
    if db.query(Stage).first():
        return

    # Seed Stages
    stage_main = Stage(
        id=str(uuid.uuid4()),
        name="Main Stage",
        location_zone="Zone North",
        max_capacity=10000,
    )
    stage_electronic = Stage(
        id=str(uuid.uuid4()),
        name="Electronic Tent",
        location_zone="Zone South",
        max_capacity=5000,
    )
    stage_acoustic = Stage(
        id=str(uuid.uuid4()),
        name="Acoustic Garden",
        location_zone="Zone East",
        max_capacity=2000,
    )
    db.add_all([stage_main, stage_electronic, stage_acoustic])

    # Seed Artists
    artist_a = Artist(
        id=str(uuid.uuid4()),
        name="The Headliners",
        genre="Rock",
        tech_spec_summary="Full drum kit, 4 guitar amps, 3 vocal mics",
    )
    artist_b = Artist(
        id=str(uuid.uuid4()),
        name="DJ Pulse",
        genre="Electronic",
        tech_spec_summary="Pioneer CDJ setup, subwoofers, laser lights",
    )
    artist_c = Artist(
        id=str(uuid.uuid4()),
        name="Acoustic Trio",
        genre="Folk",
        tech_spec_summary="3 acoustic DI inputs, 3 vocal mics",
    )
    db.add_all([artist_a, artist_b, artist_c])

    # Seed Tickets
    ticket1 = Ticket(
        id=str(uuid.uuid4()),
        ticket_code="T-99881",
        qr_payload_hash="sha256_hash_99881",
        tier="General Admission",
        status="VALID",
    )
    ticket2 = Ticket(
        id=str(uuid.uuid4()),
        ticket_code="T-99882",
        qr_payload_hash="sha256_hash_99882",
        tier="VIP Pass",
        status="VALID",
    )
    ticket3 = Ticket(
        id=str(uuid.uuid4()),
        ticket_code="T-99883",
        qr_payload_hash="sha256_hash_99883",
        tier="Staff Pass",
        status="USED",
        scanned_at=datetime.utcnow() - timedelta(minutes=30),
        scanned_gate="Gate-1",
    )
    db.add_all([ticket1, ticket2, ticket3])

    # Seed Volunteers
    vol1 = Volunteer(
        id=str(uuid.uuid4()),
        full_name="Alice Smith",
        email="alice@festival.org",
        phone="+15550100",
        assigned_zone="Gates",
        status="ACTIVE",
    )
    vol2 = Volunteer(
        id=str(uuid.uuid4()),
        full_name="Bob Jones",
        email="bob@festival.org",
        phone="+15550200",
        assigned_zone="Stages",
        status="STANDBY",
    )
    db.add_all([vol1, vol2])
    db.flush()

    # Seed Volunteer Shifts
    now = datetime.utcnow()
    shift1 = VolunteerShift(
        id=str(uuid.uuid4()),
        volunteer_id=vol1.id,
        zone_name="Gates",
        start_time=now - timedelta(hours=1),
        end_time=now + timedelta(hours=3),
        status="CHECKED_IN",
        check_in_time=now - timedelta(minutes=55),
    )
    shift2 = VolunteerShift(
        id=str(uuid.uuid4()),
        volunteer_id=None,
        zone_name="Stages",
        start_time=now + timedelta(hours=2),
        end_time=now + timedelta(hours=6),
        status="UNASSIGNED",
    )
    db.add_all([shift1, shift2])

    try:
        db.commit()
    except Exception:
        db.rollback()
