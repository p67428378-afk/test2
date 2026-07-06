from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use SQLite in-memory for tests, or fallback to a local file
database_url = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///./test.db")
if os.getenv("TESTING") == "true":
    database_url = "sqlite:///:memory:"

engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False} if "sqlite" in database_url else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
