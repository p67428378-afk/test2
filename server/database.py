import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

# SQLite needs connect_args for multithreading in dev/tests
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
    """Create database tables."""
    # Import models so they are registered on Base.metadata
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    """Seed initial data and test accounts idempotently."""
    import server.models as models
    from datetime import datetime, timezone, timedelta
    import uuid

    # 1. Seed test user records if users table exists/is used
    # Here we seed initial visitor pre-approval, package, and security alert if empty
    try:
        # Seed initial Visitor if none exist
        if db.query(models.VisitorPreApproval).count() == 0:
            now = datetime.now(timezone.utc)
            visitor = models.VisitorPreApproval(
                id=str(uuid.uuid4()),
                unit_number="Unit 4B",
                visitor_name="Bob Smith",
                contact_phone="+15550192834",
                vehicle_number="XYZ-9876",
                created_by_user="test@example.com",
                created_at=now,
            )
            db.add(visitor)
            db.flush()

            token = models.QRToken(
                id=str(uuid.uuid4()),
                visitor_id=visitor.id,
                token_signature=f"SEED_QR_TOKEN_{visitor.id}",
                valid_from=now - timedelta(hours=1),
                valid_until=now + timedelta(hours=5),
                status="ACTIVE",
            )
            db.add(token)

        # Seed initial Delivery if none exist
        if db.query(models.Delivery).count() == 0:
            delivery = models.Delivery(
                id=str(uuid.uuid4()),
                unit_number="Unit 4B",
                courier_name="FedEx",
                tracking_number="FX-99201123",
                package_description="Small box",
                status="PENDING_PICKUP",
                logged_at=datetime.now(timezone.utc),
            )
            db.add(delivery)

        # Seed initial Security Alert if none exist
        if db.query(models.SecurityAlert).count() == 0:
            now = datetime.now(timezone.utc)
            alert = models.SecurityAlert(
                id=str(uuid.uuid4()),
                alert_type="UNAUTHORIZED_ENTRY",
                severity="HIGH",
                location="North Gate",
                description="Vehicle bypassed barrier without valid QR code",
                status="ACTIVE",
                created_at=now,
                updated_at=now,
            )
            db.add(alert)

        db.commit()
    except Exception:
        db.rollback()
