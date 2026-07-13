from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)


def test_generate_password():
    # Default generation
    response = client.post(
        "/api/v1/passwords/generate",
        json={
            "length": 16,
            "lowercase": True,
            "uppercase": True,
            "numbers": True,
            "symbols": True,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["password"]) == 16
    assert data["strength"] == "Strong"

    # Custom length
    response = client.post(
        "/api/v1/passwords/generate",
        json={
            "length": 8,
            "lowercase": True,
            "uppercase": False,
            "numbers": False,
            "symbols": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["password"]) == 8
    assert data["strength"] == "Weak"
    assert data["password"].islower()

    # Invalid criteria (no character types selected)
    response = client.post(
        "/api/v1/passwords/generate",
        json={
            "length": 12,
            "lowercase": False,
            "uppercase": False,
            "numbers": False,
            "symbols": False,
        },
    )
    assert response.status_code == 400
