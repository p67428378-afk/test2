from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, SessionLocal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base
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

def test_create_payout_batch():
    response = client.post("/api/v1/payouts/batch", json={"process_due_by_date": "2024-01-01"})
    assert response.status_code == 200
    data = response.json()
    assert "batch_id" in data
    assert data["message"] == "Payout batch initiated successfully"
    assert data["status"] == "PENDING"

def test_read_payout_batches():
    response = client.get("/api/v1/payouts/batches")
    assert response.status_code == 200
    data = response.json()
    assert "batches" in data
    assert "total" in data

def test_read_payout_batch():
    response = client.post("/api/v1/payouts/batch", json={"process_due_by_date": "2024-01-01"})
    batch_id = response.json()["batch_id"]
    response = client.get(f"/api/v1/payouts/batch/{batch_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == batch_id

def test_read_payout_transactions():
    response = client.post("/api/v1/payouts/batch", json={"process_due_by_date": "2024-01-01"})
    batch_id = response.json()["batch_id"]
    response = client.get(f"/api/v1/payouts/batch/{batch_id}/transactions")
    assert response.status_code == 200
    data = response.json()
    assert "transactions" in data
    assert "total" in data
