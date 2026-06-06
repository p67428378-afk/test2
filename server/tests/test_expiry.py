
from fastapi.testclient import TestClient
from server.main import app
from server.tests.conftest import client, test_db

def test_get_expiry_alerts(client, test_db):
    response = client.get("/api/v1/expiry-alerts/")
    assert response.status_code == 200
