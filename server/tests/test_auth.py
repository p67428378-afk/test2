from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from server.auth import get_password_hash
from server.models import User


def test_login_success(client: TestClient, db_session: Session):
    # AC: Authenticate a user and return a JWT
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="test@example.com",
        full_name="Elena Rostova",
        role="Engineer",
        hashed_password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "Engineer"


def test_login_invalid_credentials(client: TestClient, db_session: Session):
    # AC: Invalid credentials returns 401
    hashed_password = get_password_hash("testpassword")
    user = User(
        email="test@example.com",
        full_name="Elena Rostova",
        role="Engineer",
        hashed_password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
