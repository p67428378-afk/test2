from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.core.config import settings

connect_args = {}
poolclass = None

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    if settings.DATABASE_URL == "sqlite:///:memory:" or settings.TESTING:
        poolclass = StaticPool

engine = create_engine(
    settings.DATABASE_URL, connect_args=connect_args, poolclass=poolclass
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
