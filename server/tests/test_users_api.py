
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import Engine
import pytest

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

def test_create_user(db_session):
    response = client.post("/api/v1/users/", json={
        "username": "testuser",
        "password": "testpassword",
        "full_name": "Test User",
        "role": "Forecaster",
        "station": "TEST-STATION"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data


def test_read_users_me_unauthenticated():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
