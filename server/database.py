from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from server.core.config import settings

# Use SQLite in-memory if settings.TESTING is True or if we are running tests
import os

db_url = settings.DATABASE_URL
if os.getenv("TESTING") == "true" or "sqlite" in db_url:
    # Ensure SQLite uses StaticPool for in-memory or check_same_thread for file
    connect_args = {"check_same_thread": False}
    if ":memory:" in db_url:
        from sqlalchemy.pool import StaticPool

        engine = create_engine(db_url, connect_args=connect_args, poolclass=StaticPool)
    else:
        engine = create_engine(db_url, connect_args=connect_args)
else:
    engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
