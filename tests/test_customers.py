
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_customer():
    response = client.post(
        "/api/v1/customers/",
        json={
            "name": "John Doe",
            "contact_information": {"email": "john.doe@example.com"}
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "John Doe"

def test_read_customers():
    response = client.get("/api/v1/customers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
