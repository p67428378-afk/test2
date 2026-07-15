from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool
from server.core.config import settings

# SQLite needs special handling so it behaves correctly under FastAPI's
# multi-threaded request handling and (for in-memory DBs) shares a single
# connection across sessions. Without this, table DDL created on one connection
# is invisible to another connection from the pool -> "no such table" errors.
connect_args = {}
engine_kwargs = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if ":memory:" in settings.DATABASE_URL or settings.DATABASE_URL.endswith("sqlite://"):
        # In-memory: force one shared connection so all sessions see the schema.
        engine_kwargs["poolclass"] = StaticPool

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
