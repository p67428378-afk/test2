from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_calculate_premium():
    response = client.post(
        "/api/v1/insurance/premium/calculate",
        json={"vehicle_value": 50000, "ncb_years": 3, "vehicle_type_multiplier": 1.2}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["base_premium"] == 500.0
    assert data["ncb_discount"] == 175.0
    assert data["premium_after_ncb"] == 325.0
    assert data["final_premium"] == 390.0
