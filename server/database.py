"""
Module: server.database
Purpose: Database connection and session management.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.config import settings

# Use StaticPool for SQLite to support multi-threaded testing
DB_URL = settings.DATABASE_URL
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)

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
