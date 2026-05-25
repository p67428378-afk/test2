import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import pytest_asyncio # Explicitly import pytest_asyncio

# Import Base and get_db directly, as they don't depend on SQLALCHEMY_DATABASE_URL directly
from backend.database import Base, get_db
from backend.main import app
from httpx import AsyncClient

pytest_plugins = ["pytest_asyncio"]

# This fixture will configure the backend.database module for testing
@pytest.fixture(name="test_db_module")
def test_db_module_fixture():
    # Import backend.database here to ensure it's reloaded/configured for each test
    from backend import database, models

    # Override the database URL for testing
    database.SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    
    # Re-create engine and SessionLocal with the test URL
    database.engine = create_engine(
        database.SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
    database.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=database.engine, expire_on_commit=False)

    # Create tables
    Base.metadata.create_all(bind=database.engine)
    yield database # Yield the configured database module
    # Drop tables after tests
    Base.metadata.drop_all(bind=database.engine)

@pytest.fixture(name="session")
def session_fixture(test_db_module): # Depend on test_db_module
    db_session = test_db_module.SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()

@pytest_asyncio.fixture(name="client") # Use pytest_asyncio.fixture
async def client_fixture(session: Session):
    app.dependency_overrides[get_db] = lambda: session
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
