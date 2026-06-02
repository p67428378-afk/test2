
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_alert_config(db_session):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "alert_test@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]

    response = client.post(
        "/api/v1/alerts/config",
        json={
            "user_id": user_id,
            "threshold_percentage": 80,
            "leak_detection_period_hours": 2
        }
    )
    assert response.status_code == 200
    config_data = response.json()
    assert config_data["threshold_percentage"] == 80

    response = client.get(f"/api/v1/alerts/config/{user_id}")
    assert response.status_code == 200
    assert response.json()["threshold_percentage"] == 80

    response = client.put(
        f"/api/v1/alerts/config/{user_id}",
        json={
            "user_id": user_id,
            "config_id": config_data["config_id"],
            "threshold_percentage": 90,
            "leak_detection_period_hours": 3
        }
    )
    assert response.status_code == 200
    assert response.json()["threshold_percentage"] == 90

    response = client.get(f"/api/v1/alerts/config/{user_id}")
    assert response.status_code == 200
    assert response.json()["threshold_percentage"] == 90
