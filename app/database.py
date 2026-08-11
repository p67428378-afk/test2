from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os

# Use an in-memory SQLite database for testing, or a file-based one if DATABASE_URL is set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# If using an in-memory SQLite database, use StaticPool
if DATABASE_URL == "sqlite:///:memory:":
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "check_same_thread": False
        },
        poolclass=StaticPool,
    )
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
