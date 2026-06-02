
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import get_db, Base

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

def test_create_alert_config():
    # First create a user
    response = client.post(
        "/api/v1/users/register",
        json={"email": "alert_user@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]

    # Then create the alert config
    response = client.post(
        "/api/v1/alerts/config",
        json={"user_id": user_id, "threshold_percentage": 80, "leak_detection_period_hours": 2},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["threshold_percentage"] == 80

def test_read_alert_config():
    # First create a user and config
    response = client.post(
        "/api/v1/users/register",
        json={"email": "alert_user2@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]
    client.post(
        "/api/v1/alerts/config",
        json={"user_id": user_id, "threshold_percentage": 70, "leak_detection_period_hours": 3},
    )

    # Then read the config
    response = client.get(f"/api/v1/alerts/config/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["threshold_percentage"] == 70

def test_update_alert_config():
    # First create a user and config
    response = client.post(
        "/api/v1/users/register",
        json={"email": "alert_user3@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]
    client.post(
        "/api/v1/alerts/config",
        json={"user_id": user_id, "threshold_percentage": 60, "leak_detection_period_hours": 4},
    )

    # Then update the config
    response = client.put(
        f"/api/v1/alerts/config/{user_id}",
        json={"threshold_percentage": 50, "leak_detection_period_hours": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["threshold_percentage"] == 50
