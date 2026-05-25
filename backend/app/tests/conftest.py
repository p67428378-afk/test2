import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models import applicant # Import your models here

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# This function will be used to override the get_db dependency in the main app
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Apply the dependency override to the app
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def client():
    """
    A fixture that provides a TestClient for the API.
    It creates the database tables before running tests and drops them after.
    """
    # Create the tables in the in-memory database
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as c:
        yield c
        
    # Drop the tables after tests are done
    Base.metadata.drop_all(bind=engine)
