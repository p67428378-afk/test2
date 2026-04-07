import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Use an environment variable for the database URL, default to in-memory SQLite for development/testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# If using SQLite, configure for in-memory or file-based access
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "check_same_thread": False
        },
        poolclass=StaticPool  # Required for SQLite in-memory to keep the same connection
    )
else:
    # For PostgreSQL or other databases
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
