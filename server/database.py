import os
import uuid
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from passlib.context import CryptContext

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hotel.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    use_engine = target_engine or engine
    Base.metadata.create_all(bind=use_engine)


def seed_data(db: Session):
    from server.models import User, Room, Guest, Reservation, Invoice, InvoiceItem

    # Seed Admin User
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            hashed_password=pwd_context.hash("adminpassword"),
            full_name="Admin Manager",
            role="admin",
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

    # Seed Regular Staff / Desk Clerk User
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            hashed_password=pwd_context.hash("testpassword"),
            full_name="Desk Clerk Staff",
            role="desk_clerk",
            is_active=True,
            is_verified=True,
        )
        db.add(test_user)

    # Seed Rooms if empty
    if db.query(Room).count() == 0:
        rooms_to_seed = [
            Room(
                id=str(uuid.uuid4()),
                room_number="101",
                room_type="Single Deluxe",
                daily_rate=120.0,
                status="Available",
            ),
            Room(
                id=str(uuid.uuid4()),
                room_number="102",
                room_type="Double Suite",
                daily_rate=220.0,
                status="Available",
            ),
            Room(
                id=str(uuid.uuid4()),
                room_number="103",
                room_type="Single Deluxe",
                daily_rate=120.0,
                status="Cleaning",
            ),
            Room(
                id=str(uuid.uuid4()),
                room_number="104",
                room_type="Double Suite",
                daily_rate=220.0,
                status="Occupied",
            ),
            Room(
                id=str(uuid.uuid4()),
                room_number="105",
                room_type="Executive Suite",
                daily_rate=350.0,
                status="Maintenance",
            ),
            Room(
                id=str(uuid.uuid4()),
                room_number="201",
                room_type="Single Deluxe",
                daily_rate=130.0,
                status="Available",
            ),
            Room(
                id=str(uuid.uuid4()),
                room_number="202",
                room_type="Double Suite",
                daily_rate=240.0,
                status="Available",
            ),
        ]
        for room in rooms_to_seed:
            db.add(room)
        db.commit()

        # Seed sample guest and reservation
        sample_guest = Guest(
            id=str(uuid.uuid4()),
            full_name="John Doe",
            email="john.doe@example.com",
            phone="+1-555-0199",
        )
        db.add(sample_guest)
        db.commit()

        sample_res = Reservation(
            id=str(uuid.uuid4()),
            guest_id=sample_guest.id,
            room_id=rooms_to_seed[3].id,
            room_type=rooms_to_seed[3].room_type,
            start_date=date.today(),
            end_date=date.fromordinal(date.today().toordinal() + 3),
            status="CHECKED_IN",
        )
        db.add(sample_res)
        db.commit()

        sample_invoice = Invoice(
            id=str(uuid.uuid4()),
            reservation_id=sample_res.id,
            room_charges=660.0,
            tax_amount=66.0,
            service_fees=25.0,
            discount_amount=0.0,
            total_amount=751.0,
            payment_status="UNPAID",
        )
        db.add(sample_invoice)
        db.commit()

        db.add(
            InvoiceItem(
                id=str(uuid.uuid4()),
                invoice_id=sample_invoice.id,
                description="Room Charges (3 nights @ $220.00)",
                amount=660.0,
            )
        )
        db.add(
            InvoiceItem(
                id=str(uuid.uuid4()),
                invoice_id=sample_invoice.id,
                description="Service Fee (WiFi & Gym)",
                amount=25.0,
            )
        )

    db.commit()
