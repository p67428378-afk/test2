import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./festival.db")

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


def init_db():
    from server.models import Base  # ensure all models register

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User, Stage, Artist, Ticket
    from server.auth import get_password_hash, generate_qr_payload

    # 1. Seed Users
    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test Gate Staff",
            "role": "GATE_STAFF",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Festival Admin",
            "role": "ADMIN",
        },
        {
            "email": "coordinator@example.com",
            "password": "testpassword",
            "full_name": "Volunteer Coordinator",
            "role": "VOLUNTEER_COORDINATOR",
        },
        {
            "email": "manager@example.com",
            "password": "testpassword",
            "full_name": "Stage Manager",
            "role": "STAGE_MANAGER",
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            user = User(
                email=u_data["email"],
                hashed_password=get_password_hash(u_data["password"]),
                full_name=u_data["full_name"],
                role=u_data["role"],
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    # 2. Seed Stages
    stages_to_seed = [
        {"name": "Main Stage", "location_zone": "Zone A", "capacity": 10000},
        {"name": "Indie Stage", "location_zone": "Zone B", "capacity": 3000},
        {"name": "Dance Arena", "location_zone": "Zone C", "capacity": 5000},
    ]

    for s_data in stages_to_seed:
        existing = db.query(Stage).filter(Stage.name == s_data["name"]).first()
        if not existing:
            stage = Stage(
                name=s_data["name"],
                location_zone=s_data["location_zone"],
                capacity=s_data["capacity"],
            )
            db.add(stage)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    # 3. Seed Artists
    artists_to_seed = [
        {
            "name": "Headliner Band A",
            "genre": "Rock",
            "contact_email": "banda@music.com",
        },
        {"name": "Electronic DJ X", "genre": "EDM", "contact_email": "djx@music.com"},
        {"name": "Indie Rock Y", "genre": "Indie", "contact_email": "rocky@music.com"},
    ]

    for a_data in artists_to_seed:
        existing = db.query(Artist).filter(Artist.name == a_data["name"]).first()
        if not existing:
            artist = Artist(
                name=a_data["name"],
                genre=a_data["genre"],
                contact_email=a_data["contact_email"],
            )
            db.add(artist)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    # 4. Seed Sample Tickets
    tickets_to_seed = [
        {"ticket_code": "TKT-1001", "tier": "General Admission"},
        {"ticket_code": "TKT-1002", "tier": "VIP"},
        {"ticket_code": "TKT-1003", "tier": "General Admission"},
    ]

    for t_data in tickets_to_seed:
        existing = (
            db.query(Ticket).filter(Ticket.ticket_code == t_data["ticket_code"]).first()
        )
        if not existing:
            payload = generate_qr_payload(t_data["ticket_code"], t_data["tier"])
            ticket = Ticket(
                ticket_code=t_data["ticket_code"],
                tier=t_data["tier"],
                qr_payload_hash=payload,
                is_used=False,
            )
            db.add(ticket)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
