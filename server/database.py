from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.core.config import settings

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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models
    from server.core.security import get_password_hash

    # Seed regular user
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        test_user = models.User(
            email="test@example.com",
            full_name="Test Member",
            role="member",
            hashed_password=get_password_hash("testpassword"),
        )
        db.add(test_user)

    # Seed librarian user
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Admin Librarian",
            role="librarian",
            hashed_password=get_password_hash("adminpassword"),
        )
        db.add(admin_user)

    # --- Seed Bus Tracking Data ---
    # Seed Routes
    r72 = db.query(models.Route).filter(models.Route.route_number == "72").first()
    if not r72:
        r72 = models.Route(route_number="72", route_name="Downtown Express")
        db.add(r72)
        db.flush()

    r14 = db.query(models.Route).filter(models.Route.route_number == "14").first()
    if not r14:
        r14 = models.Route(route_number="14", route_name="Downtown Local")
        db.add(r14)
        db.flush()

    # Seed Stops
    s1 = (
        db.query(models.Stop)
        .filter(models.Stop.stop_name == "Main Street & 1st Ave")
        .first()
    )
    if not s1:
        s1 = models.Stop(
            stop_name="Main Street & 1st Ave", latitude=40.7128, longitude=-74.0060
        )
        db.add(s1)
        db.flush()

    s2 = (
        db.query(models.Stop)
        .filter(models.Stop.stop_name == "Broadway & 42nd St")
        .first()
    )
    if not s2:
        s2 = models.Stop(
            stop_name="Broadway & 42nd St", latitude=40.7580, longitude=-73.9855
        )
        db.add(s2)
        db.flush()

    s3 = (
        db.query(models.Stop)
        .filter(models.Stop.stop_name == "Central Park West & 72nd St")
        .first()
    )
    if not s3:
        s3 = models.Stop(
            stop_name="Central Park West & 72nd St",
            latitude=40.7750,
            longitude=-73.9712,
        )
        db.add(s3)
        db.flush()

    # Seed RouteStops
    if r72 and s1:
        rs1 = (
            db.query(models.RouteStop).filter_by(route_id=r72.id, stop_id=s1.id).first()
        )
        if not rs1:
            db.add(models.RouteStop(route_id=r72.id, stop_id=s1.id, stop_order=1))
    if r72 and s2:
        rs2 = (
            db.query(models.RouteStop).filter_by(route_id=r72.id, stop_id=s2.id).first()
        )
        if not rs2:
            db.add(models.RouteStop(route_id=r72.id, stop_id=s2.id, stop_order=2))

    if r14 and s2:
        rs3 = (
            db.query(models.RouteStop).filter_by(route_id=r14.id, stop_id=s2.id).first()
        )
        if not rs3:
            db.add(models.RouteStop(route_id=r14.id, stop_id=s2.id, stop_order=1))
    if r14 and s3:
        rs4 = (
            db.query(models.RouteStop).filter_by(route_id=r14.id, stop_id=s3.id).first()
        )
        if not rs4:
            db.add(models.RouteStop(route_id=r14.id, stop_id=s3.id, stop_order=2))

    # Seed Buses
    b1 = None
    b2 = None
    b3 = None
    if r72:
        b1 = db.query(models.Bus).filter(models.Bus.vehicle_id == "BUS-72-01").first()
        if not b1:
            b1 = models.Bus(vehicle_id="BUS-72-01", route_id=r72.id)
            db.add(b1)
            db.flush()

        b2 = db.query(models.Bus).filter(models.Bus.vehicle_id == "BUS-72-02").first()
        if not b2:
            b2 = models.Bus(vehicle_id="BUS-72-02", route_id=r72.id)
            db.add(b2)
            db.flush()

    if r14:
        b3 = db.query(models.Bus).filter(models.Bus.vehicle_id == "BUS-14-01").first()
        if not b3:
            b3 = models.Bus(vehicle_id="BUS-14-01", route_id=r14.id)
            db.add(b3)
            db.flush()

    # Seed BusLocations
    if b1:
        bl1 = db.query(models.BusLocation).filter_by(bus_id=b1.id).first()
        if not bl1:
            db.add(
                models.BusLocation(bus_id=b1.id, latitude=40.7200, longitude=-74.0000)
            )
    if b2:
        bl2 = db.query(models.BusLocation).filter_by(bus_id=b2.id).first()
        if not bl2:
            db.add(
                models.BusLocation(bus_id=b2.id, latitude=40.7500, longitude=-73.9900)
            )
    if b3:
        bl3 = db.query(models.BusLocation).filter_by(bus_id=b3.id).first()
        if not bl3:
            db.add(
                models.BusLocation(bus_id=b3.id, latitude=40.7600, longitude=-73.9800)
            )

    try:
        db.commit()
    except Exception:
        db.rollback()
