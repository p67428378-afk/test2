from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def test_register_seller(client: TestClient, db: Session):
    response = client.post(
        "/api/v1/sellers/register",
        json={
            "store_name": "Apex Laptops",
            "email": "sales@apexlaptops.com",
            "phone_number": "+1-555-0199",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["store_name"] == "Apex Laptops"
    assert data["email"] == "sales@apexlaptops.com"
    assert "id" in data
    assert "created_at" in data

    # Test duplicate email registration
    response_dup = client.post(
        "/api/v1/sellers/register",
        json={
            "store_name": "Apex Laptops 2",
            "email": "sales@apexlaptops.com",
            "phone_number": "+1-555-0199",
            "password": "SecurePassword123!",
        },
    )
    assert response_dup.status_code == 400
    assert response_dup.json()["detail"] == "Email address already registered"


def test_login_seller(client: TestClient, db: Session):
    # Register first
    client.post(
        "/api/v1/sellers/register",
        json={
            "store_name": "Apex Laptops",
            "email": "sales@apexlaptops.com",
            "phone_number": "+1-555-0199",
            "password": "SecurePassword123!",
        },
    )

    # Test successful login
    response = client.post(
        "/api/v1/sellers/login",
        json={"email": "sales@apexlaptops.com", "password": "SecurePassword123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in_seconds"] == 300
    assert data["seller"]["email"] == "sales@apexlaptops.com"

    # Test invalid password login
    response_invalid = client.post(
        "/api/v1/sellers/login",
        json={"email": "sales@apexlaptops.com", "password": "WrongPassword!"},
    )
    assert response_invalid.status_code == 401
    assert response_invalid.json()["detail"] == "Invalid email or password"
