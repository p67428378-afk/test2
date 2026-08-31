import os
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if ":memory:" in DATABASE_URL or os.getenv("TESTING", "").lower() in ("true", "1"):
        engine = create_engine(
            DATABASE_URL,
            connect_args=connect_args,
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(DATABASE_URL, connect_args=connect_args)
else:
    engine = create_engine(DATABASE_URL)

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
    from server.models import Tour, Guide, Schedule, Booking, Attendance

    # Seed Tours
    tours_data = [
        {
            "id": "11111111-1111-1111-1111-111111111111",
            "title": "Renaissance Masterpieces",
            "description": "Explore Mona Lisa, Winged Victory of Samothrace, and classical Italian renaissance paintings.",
            "duration_minutes": 90,
        },
        {
            "id": "22222222-2222-2222-2222-222222222222",
            "title": "Ancient Egyptian Antiquities",
            "description": "Discover pharaoh tombs, sarcophagi, hieroglyphics, and sphinx artifacts.",
            "duration_minutes": 75,
        },
        {
            "id": "33333333-3333-3333-3333-333333333333",
            "title": "Impressionist Highlights",
            "description": "Experience Monet, Degas, Renoir, and Van Gogh masterpieces in daylight galleries.",
            "duration_minutes": 60,
        },
    ]

    for t_info in tours_data:
        existing_tour = db.query(Tour).filter(Tour.title == t_info["title"]).first()
        if not existing_tour:
            new_tour = Tour(
                id=t_info["id"],
                title=t_info["title"],
                description=t_info["description"],
                duration_minutes=t_info["duration_minutes"],
            )
            db.add(new_tour)
    db.commit()

    # Seed Guides
    guides_data = [
        {
            "id": "aaaa1111-aaaa-1111-aaaa-111111111111",
            "name": "Alice Smith",
            "email": "alice.smith@museum.org",
            "specialization": "Renaissance Art & Sculpture",
        },
        {
            "id": "bbbb2222-bbbb-2222-bbbb-222222222222",
            "name": "David Miller",
            "email": "david.miller@museum.org",
            "specialization": "Ancient Egyptian Civilizations",
        },
        {
            "id": "cccc3333-cccc-3333-cccc-333333333333",
            "name": "Elena Rostova",
            "email": "elena.rostova@museum.org",
            "specialization": "19th Century French Impressionism",
        },
    ]

    for g_info in guides_data:
        existing_guide = db.query(Guide).filter(Guide.email == g_info["email"]).first()
        if not existing_guide:
            new_guide = Guide(
                id=g_info["id"],
                name=g_info["name"],
                email=g_info["email"],
                specialization=g_info["specialization"],
            )
            db.add(new_guide)
    db.commit()

    # Seed Schedules
    now = datetime.now(timezone.utc)
    schedules_data = [
        {
            "id": "s1111111-1111-1111-1111-111111111111",
            "tour_id": "11111111-1111-1111-1111-111111111111",
            "guide_id": "aaaa1111-aaaa-1111-aaaa-111111111111",
            "start_time": now + timedelta(hours=2),
            "end_time": now + timedelta(hours=3, minutes=30),
            "max_capacity": 20,
            "status": "Published",
        },
        {
            "id": "s2222222-2222-2222-2222-222222222222",
            "tour_id": "22222222-2222-2222-2222-222222222222",
            "guide_id": "bbbb2222-bbbb-2222-bbbb-222222222222",
            "start_time": now + timedelta(hours=4),
            "end_time": now + timedelta(hours=5, minutes=15),
            "max_capacity": 15,
            "status": "Published",
        },
        {
            "id": "s3333333-3333-3333-3333-333333333333",
            "tour_id": "33333333-3333-3333-3333-333333333333",
            "guide_id": "cccc3333-cccc-3333-cccc-333333333333",
            "start_time": now + timedelta(hours=6),
            "end_time": now + timedelta(hours=7),
            "max_capacity": 25,
            "status": "Published",
        },
    ]

    for s_info in schedules_data:
        existing_sched = db.query(Schedule).filter(Schedule.id == s_info["id"]).first()
        if not existing_sched:
            new_sched = Schedule(
                id=s_info["id"],
                tour_id=s_info["tour_id"],
                guide_id=s_info["guide_id"],
                start_time=s_info["start_time"],
                end_time=s_info["end_time"],
                max_capacity=s_info["max_capacity"],
                status=s_info["status"],
            )
            db.add(new_sched)
    db.commit()

    # Seed Sample Booking
    sample_booking_id = "b1111111-1111-1111-1111-111111111111"
    existing_booking = db.query(Booking).filter(Booking.id == sample_booking_id).first()
    if not existing_booking:
        new_booking = Booking(
            id=sample_booking_id,
            schedule_id="s1111111-1111-1111-1111-111111111111",
            visitor_name="John Doe",
            visitor_email="john.doe@example.com",
            ticket_quantity=2,
            booking_status="Confirmed",
        )
        db.add(new_booking)
        db.commit()

        # Seed Sample Attendance
        sample_att_id = "c1111111-1111-1111-1111-111111111111"
        existing_att = (
            db.query(Attendance).filter(Attendance.id == sample_att_id).first()
        )
        if not existing_att:
            new_att = Attendance(
                id=sample_att_id,
                booking_id=sample_booking_id,
                schedule_id="s1111111-1111-1111-1111-111111111111",
                attended_count=2,
                notes="Checked in on time",
            )
            db.add(new_att)
            db.commit()
