
from fastapi.testclient import TestClient

def test_onboard_customer(client: TestClient):
    response = client.post(
        "/api/v1/kyc/onboard",
        json={"aadhaar_number": "123456789012", "pan_number": "ABCDE1234F"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["aadhaar_number"] == "123456789012"
    assert data["pan_number"] == "ABCDE1234F"
    assert data["status"] == "PENDING"
    assert "id" in data
    assert "created_at" in data
