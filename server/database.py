import os
import uuid
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

connect_args = {}
poolclass = None

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if ":memory:" in DATABASE_URL:
        poolclass = StaticPool

engine_kwargs = {"connect_args": connect_args}
if poolclass:
    engine_kwargs["poolclass"] = poolclass

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    from server.models.user import User  # noqa: F401
    from server.models.leave_request import LeaveRequest  # noqa: F401
    from server.models.leave_balance import LeaveBalance  # noqa: F401

    e = target_engine or engine
    Base.metadata.create_all(bind=e)


def seed_data(db: Session):
    from server.models.user import User
    from server.models.leave_request import LeaveRequest
    from server.models.leave_balance import LeaveBalance

    # Seed manager user
    manager_id = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
    manager = db.query(User).filter(User.email == "admin@example.com").first()
    if not manager:
        manager = User(
            id=manager_id,
            email="admin@example.com",
            full_name="Jane Smith",
            role="MANAGER",
            manager_id=None,
        )
        db.add(manager)
        try:
            db.commit()
            db.refresh(manager)
        except IntegrityError:
            db.rollback()
            manager = db.query(User).filter(User.email == "admin@example.com").first()

    # Seed employee user
    employee_id = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
    employee = db.query(User).filter(User.email == "test@example.com").first()
    if not employee:
        employee = User(
            id=employee_id,
            email="test@example.com",
            full_name="John Doe",
            role="EMPLOYEE",
            manager_id=manager_id,
        )
        db.add(employee)
        try:
            db.commit()
            db.refresh(employee)
        except IntegrityError:
            db.rollback()
            employee = db.query(User).filter(User.email == "test@example.com").first()

    # Seed initial leave balances for 2026
    year = 2026
    default_allocations = [
        {"leave_type": "VACATION", "allocated": 15, "used": 5, "remaining": 10},
        {"leave_type": "SICK", "allocated": 10, "used": 1, "remaining": 9},
        {"leave_type": "PERSONAL", "allocated": 5, "used": 0, "remaining": 5},
        {"leave_type": "UNPAID", "allocated": 0, "used": 0, "remaining": 0},
    ]

    for alloc in default_allocations:
        existing_bal = (
            db.query(LeaveBalance)
            .filter(
                LeaveBalance.user_id == employee_id,
                LeaveBalance.year == year,
                LeaveBalance.leave_type == alloc["leave_type"],
            )
            .first()
        )
        if not existing_bal:
            bal = LeaveBalance(
                id=str(uuid.uuid4()),
                user_id=employee_id,
                year=year,
                leave_type=alloc["leave_type"],
                allocated_days=alloc["allocated"],
                used_days=alloc["used"],
                remaining_days=alloc["remaining"],
            )
            db.add(bal)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    # Seed sample leave request
    sample_request_id = "c3a1e12f-876b-432a-9e12-32a11b987654"
    existing_req = (
        db.query(LeaveRequest).filter(LeaveRequest.id == sample_request_id).first()
    )
    if not existing_req:
        req = LeaveRequest(
            id=sample_request_id,
            user_id=employee_id,
            leave_type="VACATION",
            start_date=date(2026, 6, 1),
            end_date=date(2026, 6, 5),
            total_days=5,
            reason="Annual Family Vacation",
            status="PENDING",
            manager_comment=None,
        )
        db.add(req)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
