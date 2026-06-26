"""
Module: database
Purpose: Database connection and session management.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.config import settings

DATABASE_URL = os.getenv("DATABASE_URL", settings.DATABASE_URL)

# Use StaticPool for SQLite in-memory database to support multi-threaded tests
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
poolclass = (
    StaticPool if "sqlite" in DATABASE_URL and ":memory:" in DATABASE_URL else None
)

engine = create_engine(DATABASE_URL, connect_args=connect_args, poolclass=poolclass)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Database session dependency.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
