import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

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

def test_get_alerts():
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert any(a["severity"] == "critical" for a in data)

def test_acknowledge_alert():
    response = client.get("/api/v1/alerts")
    alerts = response.json()
    active_alert = next(a for a in alerts if a["status"] == "active")
    
    response_ack = client.put(f"/api/v1/alerts/{active_alert['id']}/acknowledge")
    assert response_ack.status_code == 200
    data = response_ack.json()
    assert data["status"] == "acknowledged"

def test_acknowledge_alert_not_found():
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.put(f"/api/v1/alerts/{fake_id}/acknowledge")
    assert response.status_code == 404
    assert response.json()["detail"] == "Alert not found"
