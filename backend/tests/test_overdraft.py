from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend import crud, models, schemas

def test_create_linked_account(client: TestClient, db_session: Session):
    response = client.post(
        "/overdraft/link-account",
        json={
            "customer_id": "cust123",
            "checking_account_id": "chk123",
            "savings_account_id": "sav456"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Account linked successfully"
    assert data["linked_account"]["customer_id"] == "cust123"
    assert data["linked_account"]["checking_account_id"] == "chk123"
    assert data["linked_account"]["savings_account_id"] == "sav456"
    assert data["linked_account"]["is_enabled"] is True

    # Verify in DB
    linked_acc = crud.get_linked_account(db_session, "chk123")
    assert linked_acc is not None
    assert linked_acc.savings_account_id == "sav456"

def test_get_linked_account(client: TestClient, db_session: Session):
    # First, create an account
    crud.create_linked_account(db_session, schemas.LinkedAccountCreate(customer_id="cust123", checking_account_id="chk123", savings_account_id="sav456"))

    response = client.get("/overdraft/linked-account/chk123")
    assert response.status_code == 200
    data = response.json()
    assert data["customer_id"] == "cust123"
    assert data["checking_account_id"] == "chk123"
    assert data["savings_account_id"] == "sav456"

def test_update_overdraft_protection_status(client: TestClient, db_session: Session):
    # First, create an account
    crud.create_linked_account(db_session, schemas.LinkedAccountCreate(customer_id="cust123", checking_account_id="chk123", savings_account_id="sav456"))

    response = client.put(
        "/overdraft/linked-account/chk123/status",
        json={"is_enabled": False}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_enabled"] is False

    # Verify in DB
    linked_acc = crud.get_linked_account(db_session, "chk123")
    assert linked_acc.is_enabled is False

def test_unlink_account(client: TestClient, db_session: Session):
    # First, create an account
    crud.create_linked_account(db_session, schemas.LinkedAccountCreate(customer_id="cust123", checking_account_id="chk123", savings_account_id="sav456"))

    response = client.delete("/overdraft/unlink-account/chk123")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Account unlinked successfully"

    # Verify in DB
    linked_acc = crud.get_linked_account(db_session, "chk123")
    assert linked_acc is None

def test_get_overdraft_history(client: TestClient, db_session: Session):
    # Create some history
    event1 = schemas.OverdraftTransferEventCreate(
        transaction_id="txn1", checking_account_id="chk123", savings_account_id="sav456",
        amount=50.0, status="Success", reason=None
    )
    event2 = schemas.OverdraftTransferEventCreate(
        transaction_id="txn2", checking_account_id="chk123", savings_account_id="sav456",
        amount=100.0, status="Failed", reason="Insufficient Funds"
    )
    crud.create_overdraft_transfer_event(db_session, event1)
    crud.create_overdraft_transfer_event(db_session, event2)

    response = client.get("/overdraft/chk123/history")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["amount"] == 50.0
    assert data[1]["status"] == "Failed"

def test_update_notification_preferences(client: TestClient, db_session: Session):
    # Assuming a customer_id for testing
    customer_id = "cust123"

    # Test enabling SMS notifications
    response = client.put(
        f"/overdraft/preferences/{customer_id}",
        json={"sms_enabled": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sms_enabled"] is True
    assert data["email_enabled"] is True # Default is True

    # Test disabling email notifications
    response = client.put(
        f"/overdraft/preferences/{customer_id}",
        json={"email_enabled": False}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sms_enabled"] is True
    assert data["email_enabled"] is False

def test_get_notification_preferences(client: TestClient, db_session: Session):
    customer_id = "cust123"
    # Ensure preferences are set first (e.g., by a previous test or setup)
    client.put(f"/overdraft/preferences/{customer_id}", json={"email_enabled": False, "sms_enabled": True})

    response = client.get(f"/overdraft/preferences/{customer_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["customer_id"] == customer_id
    assert data["email_enabled"] is False
    assert data["sms_enabled"] is True
