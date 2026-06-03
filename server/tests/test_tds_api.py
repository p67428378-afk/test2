from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, SessionLocal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base
from server.crud import tds_crud
from server.schemas.tds import TDSConfigurationCreate
import pytest
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def db_session():
    db = TestingSessionLocal()
    yield db
    db.close()

def test_read_tds_configurations(db_session):
    response = client.get("/api/v1/tds/configurations")
    assert response.status_code == 200
    data = response.json()
    assert "configurations" in data

def test_update_tds_configuration(db_session):
    config = TDSConfigurationCreate(
        customer_category="RESIDENT",
        min_interest_threshold=5000,
        tds_rate=10,
        effective_date=datetime.now()
    )
    db_config = tds_crud.create_tds_configuration(db_session, config)

    response = client.put(
        f"/api/v1/tds/configurations/{db_config.id}",
        json={"min_interest_threshold": 6000}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["min_interest_threshold"] == 6000
