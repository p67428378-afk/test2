from fastapi.testclient import TestClient


def test_login_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/token", json={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_failure(client: TestClient):
    response = client.post(
        "/api/v1/auth/token", json={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Incorrect username or password"
