
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.main import app
from backend import models, schemas


def test_create_transaction(client: TestClient):
    response = client.post(
        "/transactions/",
        json={"transaction_id": "txn_12345", "amount": 100.0, "sender": "test_sender", "receiver": "test_receiver", "device_fingerprint": "fingerprint_123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["transaction_id"] == "txn_12345"
    assert data["amount"] == 100.0
    assert data["status"] == "PENDING"

def test_get_transactions(client: TestClient, session: Session):
    # Create a transaction to test with
    transaction = models.Transaction(transaction_id="txn_1", amount=10.0, sender="s1", receiver="r1", device_fingerprint="fp1")
    session.add(transaction)
    session.commit()

    response = client.get("/transactions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["transaction_id"] == "txn_1"

def test_get_transaction_by_id(client: TestClient, session: Session):
    transaction = models.Transaction(transaction_id="txn_2", amount=20.0, sender="s2", receiver="r2", device_fingerprint="fp2")
    session.add(transaction)
    session.commit()

    response = client.get(f"/transactions/{transaction.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["transaction_id"] == "txn_2"

def test_update_transaction_status(client: TestClient, session: Session):
    transaction = models.Transaction(transaction_id="txn_3", amount=30.0, sender="s3", receiver="r3", device_fingerprint="fp3")
    session.add(transaction)
    session.commit()

    response = client.patch(f"/transactions/{transaction.id}", json={"status": "ALLOWED"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ALLOWED"
