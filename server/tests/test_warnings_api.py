
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import Engine
import pytest
from datetime import datetime, timedelta

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# @event.listens_for(Engine, "connect")
# def set_sqlite_pragma(dbapi_connection, connection_record):
#     dbapi_connection.enable_load_extension(True)
#     cursor = dbapi_connection.cursor()
#     cursor.execute("PRAGMA foreign_keys=ON")
#     cursor.execute("SELECT load_extension('mod_spatialite')")
#     cursor.close()

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_auth_token(db_session):
    client.post("/api/v1/users/", json={
        "username": "testuser",
        "password": "testpassword",
        "full_name": "Test User",
        "role": "Forecaster",
        "station": "TEST-STATION"
    })
    response = client.post("/api/v1/token", data={"username": "testuser", "password": "testpassword"})
    return response.json()["access_token"]

def test_get_warnings(db_session):
    token = get_auth_token(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/warnings", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_issue_warning(db_session):
    token = get_auth_token(db_session)
    headers = {"Authorization": f"Bearer {token}"}
    start_time = datetime.utcnow().isoformat()
    end_time = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    response = client.post("/api/v1/warnings", headers=headers, json={
        "warning_type": "Tornado",
        "severity": "High",
        "details": "Test warning",
        "polygon_coords": [],
        "start_time": start_time,
        "end_time": end_time
    })
    assert response.status_code == 200
    data = response.json()
    assert data["warning_type"] == "Tornado"
