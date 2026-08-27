import uuid
import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import IntegrityError
import bcrypt
from server.config import settings

logger = logging.getLogger(__name__)

# Engine configuration
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
else:
    engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    import server.models.user  # noqa: F401
    import server.models.campaign  # noqa: F401
    import server.models.donation  # noqa: F401

    Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def seed_data(db: Session):
    from server.models.user import User
    from server.models.campaign import Campaign

    # 1. Seed Donor User
    donor_email = "test@example.com"
    donor = db.query(User).filter(User.email == donor_email).first()
    if not donor:
        try:
            donor = User(
                id=str(uuid.uuid4()),
                email=donor_email,
                full_name="Test Donor",
                hashed_password=hash_password("testpassword"),
                role="Donor",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(donor)
            db.commit()
            logger.info("Seeded donor user: test@example.com")
        except IntegrityError:
            db.rollback()

    # 2. Seed Admin User
    admin_email = "admin@example.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        try:
            admin = User(
                id=str(uuid.uuid4()),
                email=admin_email,
                full_name="Admin User",
                hashed_password=hash_password("adminpassword"),
                role="Admin",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(admin)
            db.commit()
            logger.info("Seeded admin user: admin@example.com")
        except IntegrityError:
            db.rollback()

    # 3. Seed Initial Campaigns if none exist
    campaign_count = db.query(Campaign).count()
    if campaign_count == 0:
        now = datetime.now(timezone.utc)
        sample_campaigns = [
            Campaign(
                id="c3a1b2c4-8d9e-4f1a-b2c3-d4e5f6a7b8c9",
                title="Winter Coat Drive 2026",
                description="Providing warm coats and winter gear for vulnerable families in our community.",
                target_amount=2500.00,
                current_amount=1250.00,
                category="Community",
                status="Active",
                start_date=now - timedelta(days=30),
                end_date=now + timedelta(days=60),
                created_at=now,
                updated_at=now,
            ),
            Campaign(
                id="e4b2c3d5-9e0f-5a2b-c3d4-e5f6a7b8c9d0",
                title="Clean Water Initiative",
                description="Building sustainable water wells and filtration systems for remote villages.",
                target_amount=10000.00,
                current_amount=3400.00,
                category="Environment",
                status="Active",
                start_date=now - timedelta(days=15),
                end_date=now + timedelta(days=90),
                created_at=now,
                updated_at=now,
            ),
            Campaign(
                id="f5c3d4e6-0a1b-6c3d-e4f5-a6b7c8d9e0f1",
                title="Emergency Medical Support Fund",
                description="Providing financial assistance for urgent medical treatments and surgeries.",
                target_amount=15000.00,
                current_amount=8200.00,
                category="Medical",
                status="Active",
                start_date=now - timedelta(days=10),
                end_date=now + timedelta(days=45),
                created_at=now,
                updated_at=now,
            ),
        ]
        try:
            for c in sample_campaigns:
                db.add(c)
            db.commit()
            logger.info("Seeded 3 sample campaigns")
        except IntegrityError:
            db.rollback()
