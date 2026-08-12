from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

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
    from server import models  # noqa: F401

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
            full_name="Test Commuter",
            role="member",
            hashed_password=get_password_hash("testpassword"),
            is_active=True,
            is_verified=True,
        )
        db.add(test_user)

    # Seed admin user
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Transit Operator Admin",
            role="admin",
            hashed_password=get_password_hash("adminpassword"),
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)

    # Seed Routes
    route_red = db.query(models.Route).filter(models.Route.code == "RED_LINE").first()
    if not route_red:
        route_red = models.Route(
            name="Red Line Express", code="RED_LINE", color_code="#EF4444"
        )
        db.add(route_red)

    route_blue = db.query(models.Route).filter(models.Route.code == "BLUE_LINE").first()
    if not route_blue:
        route_blue = models.Route(
            name="Blue Line Commuter", code="BLUE_LINE", color_code="#2563EB"
        )
        db.add(route_blue)

    db.flush()

    # Seed Stations
    central_st = (
        db.query(models.Station).filter(models.Station.code == "CENTRAL").first()
    )
    if not central_st:
        central_st = models.Station(
            name="Central Station",
            code="CENTRAL",
            latitude=37.7749,
            longitude=-122.4194,
        )
        db.add(central_st)

    north_st = db.query(models.Station).filter(models.Station.code == "NORTH").first()
    if not north_st:
        north_st = models.Station(
            name="North Terminal",
            code="NORTH",
            latitude=37.7880,
            longitude=-122.4075,
        )
        db.add(north_st)

    union_st = db.query(models.Station).filter(models.Station.code == "UNION").first()
    if not union_st:
        union_st = models.Station(
            name="Union Depot",
            code="UNION",
            latitude=37.7600,
            longitude=-122.4300,
        )
        db.add(union_st)

    db.flush()

    # Seed Trains
    now = datetime.now(timezone.utc)
    train_101 = (
        db.query(models.Train).filter(models.Train.train_number == "TR-101").first()
    )
    if not train_101:
        train_101 = models.Train(
            train_number="TR-101",
            route_id=route_red.id,
            status="active",
            latitude=37.7750,
            longitude=-122.4180,
            speed=45.5,
            heading=90.0,
            last_telemetry_at=now,
        )
        db.add(train_101)

    train_102 = (
        db.query(models.Train).filter(models.Train.train_number == "TR-102").first()
    )
    if not train_102:
        train_102 = models.Train(
            train_number="TR-102",
            route_id=route_blue.id,
            status="active",
            latitude=37.7850,
            longitude=-122.4100,
            speed=38.0,
            heading=180.0,
            last_telemetry_at=now,
        )
        db.add(train_102)

    db.flush()

    # Seed Schedules
    sched_1 = (
        db.query(models.Schedule)
        .filter(
            models.Schedule.train_id == train_101.id,
            models.Schedule.station_id == central_st.id,
        )
        .first()
    )
    if not sched_1:
        sched_1 = models.Schedule(
            train_id=train_101.id,
            station_id=central_st.id,
            scheduled_arrival=now + timedelta(minutes=15),
            scheduled_departure=now + timedelta(minutes=18),
        )
        db.add(sched_1)

    sched_2 = (
        db.query(models.Schedule)
        .filter(
            models.Schedule.train_id == train_102.id,
            models.Schedule.station_id == north_st.id,
        )
        .first()
    )
    if not sched_2:
        sched_2 = models.Schedule(
            train_id=train_102.id,
            station_id=north_st.id,
            scheduled_arrival=now + timedelta(minutes=30),
            scheduled_departure=now + timedelta(minutes=33),
        )
        db.add(sched_2)

    try:
        db.commit()
    except Exception:
        db.rollback()
