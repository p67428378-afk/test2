from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend import models, schemas

def test_link_account(client: TestClient, db_session: Session):
    # Test case 1: Successfully link an account
    account_data = {
        "checking_account_id": "CHK-123",
        "savings_account_id": "SAV-456",
        "is_enabled": True,
        "notification_preferences": {"email": True, "sms": False}
    }
    response = client.post("/api/v1/overdraft-protection/link-account", json=account_data)
    assert response.status_code == 200
    data = response.json()
    assert data["checking_account_id"] == "CHK-123"
    assert data["savings_account_id"] == "SAV-456"
    assert data["is_enabled"] is True
    assert data["notification_preferences"] == {"email": True, "sms": False}
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

    # Verify the account is in the database
    account_in_db = db_session.query(models.AccountConfiguration).filter(
        models.AccountConfiguration.checking_account_id == "CHK-123"
    ).first()
    assert account_in_db is not None
    assert account_in_db.savings_account_id == "SAV-456"

    # Test case 2: Attempt to link an account with existing checking_account_id
    response = client.post("/api/v1/overdraft-protection/link-account", json=account_data)
    assert response.status_code == 400
    assert "Account with checking_account_id CHK-123 already exists" in response.json()["detail"]

    # Test case 3: Attempt to link an account with existing savings_account_id
    account_data_2 = {
        "checking_account_id": "CHK-789",
        "savings_account_id": "SAV-456", # Duplicate savings_account_id
        "is_enabled": True,
        "notification_preferences": {"email": True, "sms": False}
    }
    response = client.post("/api/v1/overdraft-protection/link-account", json=account_data_2)
    assert response.status_code == 400
    assert "Account with savings_account_id SAV-456 already exists" in response.json()["detail"]


def test_get_account_configuration(client: TestClient, db_session: Session):
    # First, link an account
    account_data = {
        "checking_account_id": "CHK-GET-1",
        "savings_account_id": "SAV-GET-1",
        "is_enabled": True,
        "notification_preferences": {"email": True}
    }
    post_response = client.post("/api/v1/overdraft-protection/link-account", json=account_data)
    assert post_response.status_code == 200
    created_account_id = post_response.json()["id"]

    # Test case 1: Successfully retrieve an account configuration by ID
    response = client.get(f"/api/v1/overdraft-protection/account/{created_account_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_account_id
    assert data["checking_account_id"] == "CHK-GET-1"

    # Test case 2: Attempt to retrieve a non-existent account
    response = client.get(f"/api/v1/overdraft-protection/account/non-existent-id")
    assert response.status_code == 404
    assert "Account configuration not found" in response.json()["detail"]


def test_update_account_configuration(client: TestClient, db_session: Session):
    # First, link an account
    account_data = {
        "checking_account_id": "CHK-UPDATE-1",
        "savings_account_id": "SAV-UPDATE-1",
        "is_enabled": True,
        "notification_preferences": {"email": True}
    }
    post_response = client.post("/api/v1/overdraft-protection/link-account", json=account_data)
    assert post_response.status_code == 200
    created_account_id = post_response.json()["id"]

    # Test case 1: Successfully update is_enabled
    update_data = {"is_enabled": False}
    response = client.put(f"/api/v1/overdraft-protection/account/{created_account_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_account_id
    assert data["is_enabled"] is False

    # Verify in DB
    account_in_db = db_session.query(models.AccountConfiguration).filter_by(id=created_account_id).first()
    assert account_in_db.is_enabled is False

    # Test case 2: Successfully update notification_preferences
    update_data = {"notification_preferences": {"sms": True, "email": False}}
    response = client.put(f"/api/v1/overdraft-protection/account/{created_account_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["notification_preferences"] == {"sms": True, "email": False}

    # Verify in DB
    account_in_db = db_session.query(models.AccountConfiguration).filter_by(id=created_account_id).first()
    assert account_in_db.notification_preferences == {"sms": True, "email": False}

    # Test case 3: Attempt to update non-existent account
    response = client.put(f"/api/v1/overdraft-protection/account/non-existent-id", json=update_data)
    assert response.status_code == 404
    assert "Account configuration not found" in response.json()["detail"]


def test_delete_account_configuration(client: TestClient, db_session: Session):
    # First, link an account
    account_data = {
        "checking_account_id": "CHK-DELETE-1",
        "savings_account_id": "SAV-DELETE-1",
        "is_enabled": True,
        "notification_preferences": {"email": True}
    }
    post_response = client.post("/api/v1/overdraft-protection/link-account", json=account_data)
    assert post_response.status_code == 200
    created_account_id = post_response.json()["id"]

    # Test case 1: Successfully delete an account
    response = client.delete(f"/api/v1/overdraft-protection/account/{created_account_id}")
    assert response.status_code == 204 # No Content

    # Verify account is deleted from DB
    account_in_db = db_session.query(models.AccountConfiguration).filter_by(id=created_account_id).first()
    assert account_in_db is None

    # Test case 2: Attempt to delete a non-existent account
    response = client.delete(f"/api/v1/overdraft-protection/account/non-existent-id")
    assert response.status_code == 404
    assert "Account configuration not found" in response.json()["detail"]
