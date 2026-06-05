
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_estimate_tca():
    response = client.post(
        "/api/v1/tca/estimate",
        json={"instrument_id": "TSLA", "quantity": 100, "order_type": "MARKET"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "estimated_cost" in data
    assert data["estimated_cost"] == 1.0 # 100 * 0.01
