import pytest
from fastapi.testclient import TestClient
from server.main import app


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Trigger startup events to seed users
    with TestClient(app) as client:
        yield client


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    # Login as seeded admin
    login_data = {"email": "admin@example.com", "password": "adminpassword"}
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def user_token(client):
    # Login as seeded test user
    login_data = {"email": "test@example.com", "password": "testpassword"}
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]


def test_pet_crud_and_filtering(client, admin_token, user_token):
    # Create a pet as admin
    pet_data = {
        "name": "Buddy",
        "breed": "Golden Retriever",
        "age": 2.5,
        "location": "San Francisco",
        "status": "Available",
        "photo_url": "http://example.com/buddy.jpg",
        "description": "A very friendly dog.",
    }
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.post("/api/v1/pets/admin/pets", json=pet_data, headers=headers)
    assert response.status_code == 201
    pet = response.json()
    assert pet["name"] == "Buddy"
    assert "id" in pet
    pet_id = pet["id"]

    # Try to create a pet as normal user (should fail)
    user_headers = {"Authorization": f"Bearer {user_token}"}
    response = client.post(
        "/api/v1/pets/admin/pets", json=pet_data, headers=user_headers
    )
    assert response.status_code == 403

    # Get pet details
    response = client.get(f"/api/v1/pets/{pet_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Buddy"

    # Get non-existent pet
    response = client.get("/api/v1/pets/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404

    # List and filter pets
    response = client.get("/api/v1/pets?breed=Golden&location=San")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert data["items"][0]["name"] == "Buddy"

    # Update pet as admin
    pet_data["name"] = "Buddy Updated"
    response = client.put(
        f"/api/v1/pets/admin/pets/{pet_id}", json=pet_data, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Buddy Updated"

    # Delete pet as admin
    response = client.delete(f"/api/v1/pets/admin/pets/{pet_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["success"] is True
