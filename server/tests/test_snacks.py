
from fastapi.testclient import TestClient
from server.main import app
from server.tests.conftest import client, test_db

def test_request_snack(client, test_db):
    response = client.post("/api/v1/snacks/", json={"name": "test snack", "quantity": 10})
    assert response.status_code == 200
    assert response.json()["message"] == "Snack request received"
