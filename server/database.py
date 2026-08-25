import os
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Idempotently create all tables."""
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    """Idempotently seed test users and initial sample fines."""
    from server.models import User, Fine, AuditLog

    # Seed Admin User
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        hashed_pw = pwd_context.hash("adminpassword")
        admin_user = User(
            email="admin@example.com",
            hashed_password=hashed_pw,
            role="admin",
            is_active=True,
        )
        db.add(admin_user)

    # Seed Regular User
    user = db.query(User).filter(User.email == "test@example.com").first()
    if not user:
        hashed_pw = pwd_context.hash("testpassword")
        reg_user = User(
            email="test@example.com",
            hashed_password=hashed_pw,
            role="user",
            is_active=True,
        )
        db.add(reg_user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # Seed Sample Fines
    fine1 = db.query(Fine).filter(Fine.ticket_number == "FN-98765").first()
    now_utc = datetime.now(timezone.utc)
    if not fine1:
        fine1 = Fine(
            ticket_number="FN-98765",
            license_plate="ABC-1234",
            violation_type="Overtime Parking",
            location="Zone 4 - Main St",
            amount=50.00,
            status="PAID",
            issue_date=now_utc - timedelta(days=10),
            due_date=now_utc + timedelta(days=20),
            payment_timestamp=now_utc - timedelta(days=2),
            transaction_reference="TXN-44321",
        )
        db.add(fine1)

    fine2 = db.query(Fine).filter(Fine.ticket_number == "FN-10001").first()
    if not fine2:
        fine2 = Fine(
            ticket_number="FN-10001",
            license_plate="XYZ-5678",
            violation_type="No Parking Zone",
            location="Zone 2 - Broadway",
            amount=35.00,
            status="UNPAID",
            issue_date=now_utc - timedelta(days=5),
            due_date=now_utc + timedelta(days=15),
        )
        db.add(fine2)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # Seed Audit Log entry
    if fine1 and not db.query(AuditLog).filter(AuditLog.fine_id == fine1.id).first():
        log1 = AuditLog(
            fine_id=fine1.id,
            actor_id="admin@example.com",
            action="CREATE",
            notes="Initial ticket creation",
        )
        db.add(log1)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
