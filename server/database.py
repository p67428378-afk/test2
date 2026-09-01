import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from server.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import all models so they are registered with Base.metadata
    from server.models.visitor import Visitor  # noqa: F401
    from server.models.inmate import Inmate  # noqa: F401
    from server.models.appointment import Appointment  # noqa: F401
    from server.models.verification import Verification  # noqa: F401
    from server.models.entry_exit_log import EntryExitLog  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models.inmate import Inmate
    from server.models.visitor import Visitor

    # Seed Inmates if none exist
    inmate_count = db.query(Inmate).count()
    if inmate_count == 0:
        inmates = [
            Inmate(
                id=uuid.uuid4(),
                inmate_number="INM-1001",
                full_name="John Doe",
                cell_location="Block A, Cell 12",
                status="ACTIVE",
            ),
            Inmate(
                id=uuid.uuid4(),
                inmate_number="INM-1002",
                full_name="Robert Smith",
                cell_location="Block B, Cell 04",
                status="ACTIVE",
            ),
            Inmate(
                id=uuid.uuid4(),
                inmate_number="INM-1003",
                full_name="Jane Miller",
                cell_location="Block C, Cell 08",
                status="ACTIVE",
            ),
            Inmate(
                id=uuid.uuid4(),
                inmate_number="INM-1004",
                full_name="Michael Brown",
                cell_location="Block A, Cell 01",
                status="INACTIVE",
            ),
        ]
        db.add_all(inmates)
        try:
            db.commit()
        except Exception:
            db.rollback()

    # Seed test visitors
    visitor_test = db.query(Visitor).filter(Visitor.email == "test@example.com").first()
    if not visitor_test:
        visitor_test = Visitor(
            id=uuid.uuid4(),
            full_name="Test Visitor",
            national_id="NAT-99887766",
            email="test@example.com",
            phone="555-0199",
            address="123 Main St, Springfield",
            photo_id_url="https://example.com/photos/id_test.jpg",
            verification_status="VERIFIED",
        )
        db.add(visitor_test)
        try:
            db.commit()
        except Exception:
            db.rollback()

    visitor_pending = (
        db.query(Visitor).filter(Visitor.email == "pending@example.com").first()
    )
    if not visitor_pending:
        visitor_pending = Visitor(
            id=uuid.uuid4(),
            full_name="Pending Visitor",
            national_id="NAT-11223344",
            email="pending@example.com",
            phone="555-0188",
            address="456 Elm St, Springfield",
            photo_id_url="https://example.com/photos/id_pending.jpg",
            verification_status="PENDING",
        )
        db.add(visitor_pending)
        try:
            db.commit()
        except Exception:
            db.rollback()
