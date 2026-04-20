
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, schemas
from app.models import User, Account


def test_create_user(test_client: TestClient, db_session: Session):
    user_data = {"username": "testuser", "email": "test@example.com", "password": "testpassword"}
    response = test_client.post("/api/v1/users/", json=user_data) # This endpoint does not exist yet
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert "id" in data

    user = db_session.query(User).filter(User.id == data["id"]).first()
    assert user is not None
    assert user.email == user_data["email"]

def test_read_accounts_for_user(test_client: TestClient, db_session: Session):
    # Create a user
    user = schemas.UserCreate(username="testuser2", email="test2@example.com", password="testpassword")
    db_user = crud.create_user(db=db_session, user=user)

    # Create accounts for the user
    account1 = schemas.AccountCreate(account_type="Checking", balance=1500.00)
    crud.create_user_account(db=db_session, account=account1, user_id=db_user.id)
    account2 = schemas.AccountCreate(account_type="Savings", balance=10000.00)
    crud.create_user_account(db=db_session, account=account2, user_id=db_user.id)

    # Make a request to the endpoint
    response = test_client.get(f"/api/v1/users/{db_user.id}/accounts/") # This endpoint does not exist yet
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["account_type"] == "Checking"
    assert data[0]["balance"] == 1500.00
    assert data[1]["account_type"] == "Savings"
    assert data[1]["balance"] == 10000.00

def test_read_accounts_for_user_no_accounts(test_client: TestClient, db_session: Session):
    # Create a user
    user = schemas.UserCreate(username="testuser3", email="test3@example.com", password="testpassword")
    db_user = crud.create_user(db=db_session, user=user)

    # Make a request to the endpoint
    response = test_client.get(f"/api/v1/users/{db_user.id}/accounts/") # This endpoint does not exist yet
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0

def test_read_all_accounts(test_client: TestClient, db_session: Session):
    # Create a user
    user = schemas.UserCreate(username="testuser4", email="test4@example.com", password="testpassword")
    db_user = crud.create_user(db=db_session, user=user)

    # Create accounts for the user
    account1 = schemas.AccountCreate(account_type="Checking", balance=2500.00)
    crud.create_user_account(db=db_session, account=account1, user_id=db_user.id)

    response = test_client.get("/api/v1/accounts/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["account_type"] == "Checking"
    assert data[0]["balance"] == 2500.00
