"""
Module: database
Purpose: Database connection, session management, schema initialization, and seeding
"""

import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.config import settings

DATABASE_URL = os.getenv("DATABASE_URL", settings.DATABASE_URL)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

poolclass = None
if "sqlite:///:memory:" in DATABASE_URL or DATABASE_URL == "sqlite://":
    poolclass = StaticPool

engine = create_engine(DATABASE_URL, connect_args=connect_args, poolclass=poolclass)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Dependency to get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database schema (create all tables).
    """
    from server.app.models.user import User  # noqa
    from server.app.models.route import Route  # noqa
    from server.app.models.stop import Stop, RouteStop  # noqa
    from server.app.models.bus import Bus, TelemetryLog  # noqa
    from server.app.models.alert import Alert  # noqa

    Base.metadata.create_all(bind=engine)


def seed_data(db=None):
    """
    Seed initial test data idempotently.
    """
    close_session = False
    if db is None:
        db = SessionLocal()
        close_session = True

    try:
        from server.app.models.user import User
        from server.app.services.auth import get_password_hash

        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                id=str(uuid.uuid4()),
                email="test@example.com",
                hashed_password=get_password_hash("testpassword"),
                role="passenger",
                is_active=True,
                is_verified=True,
            )
            db.add(test_user)

        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                id=str(uuid.uuid4()),
                email="admin@example.com",
                hashed_password=get_password_hash("adminpassword"),
                role="admin",
                is_active=True,
                is_verified=True,
            )
            db.add(admin_user)

        db.commit()
    except Exception:
        db.rollback()
    finally:
        if close_session:
            db.close()
