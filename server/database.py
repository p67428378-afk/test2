from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.core.config import settings

if settings.TESTING:
    engine = create_engine(settings.TEST_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
