
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_initiate_payout_batch():
    response = client.post("/api/v1/payouts/batch", json={"process_due_by_date": "2024-12-31"})
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
    # First, create a batch to have a valid ID
    response = client.post("/api/v1/payouts/batch", json={"process_due_by_date": "2024-12-31"})
    batch_id = response.json()["batch_id"]

    response = client.get(f"/api/v1/payouts/batch/{batch_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == batch_id

def test_read_payout_transactions():
    # First, create a batch to have a valid ID
    response = client.post("/api/v1/payouts/batch", json={"process_due_by_date": "2024-12-31"})
    batch_id = response.json()["batch_id"]

    response = client.get(f"/api/v1/payouts/batch/{batch_id}/transactions")
    assert response.status_code == 200
    data = response.json()
    assert "transactions" in data
    assert "total" in data
