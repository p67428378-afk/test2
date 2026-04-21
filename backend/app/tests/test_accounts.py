from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings

def test_read_accounts_empty(client: TestClient, db_session: Session):
    response = client.get(f"{settings.API_V1_STR}/accounts/")
    assert response.status_code == 200
    assert response.json() == []

def test_create_account(client: TestClient, db_session: Session):
    response = client.post(
        f"{settings.API_V1_STR}/accounts/",
        json={"account_number": "1234567890", "account_type": "checking", "balance": 1500.00, "currency": "USD"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["account_number"] == "1234567890"
    assert data["account_type"] == "checking"
    assert data["balance"] == 1500.00
    assert data["currency"] == "USD"
    assert "id" in data

def test_read_accounts(client: TestClient, db_session: Session):
    client.post(
        f"{settings.API_V1_STR}/accounts/",
        json={"account_number": "1234567890", "account_type": "checking", "balance": 1500.00, "currency": "USD"},
    )
    client.post(
        f"{settings.API_V1_STR}/accounts/",
        json={"account_number": "0987654321", "account_type": "savings", "balance": 5000.00, "currency": "USD"},
    )

    response = client.get(f"{settings.API_V1_STR}/accounts/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["account_number"] == "1234567890"
    assert data[1]["account_number"] == "0987654321"

def test_read_account(client: TestClient, db_session: Session):
    response = client.post(
        f"{settings.API_V1_STR}/accounts/",
        json={"account_number": "1234567890", "account_type": "checking", "balance": 1500.00, "currency": "USD"},
    )
    account_id = response.json()["id"]

    response = client.get(f"{settings.API_V1_STR}/accounts/{account_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["account_number"] == "1234567890"
    assert data["id"] == account_id

def test_read_account_not_found(client: TestClient, db_session: Session):
    response = client.get(f"{settings.API_V1_STR}/accounts/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Account not found"}
