import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.config import settings

# If testing, use SQLite in-memory
if settings.TESTING or os.getenv("TESTING") == "true":
    DATABASE_URL = "sqlite:///:memory:"
else:
    DATABASE_URL = settings.DATABASE_URL

connect_args = {}
engine_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    # Use StaticPool for in-memory SQLite to share the connection across sessions
    if DATABASE_URL == "sqlite:///:memory:" or ":memory:" in DATABASE_URL:
        engine_args["poolclass"] = StaticPool

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
