
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_get_market_depth():
    response = client.get("/api/v1/market-data/depth/AAPL")
    assert response.status_code == 200
    data = response.json()
    assert data["instrument_id"] == "AAPL"
    assert "bid_price" in data
    assert "ask_price" in data

def test_get_market_depth_not_found():
    response = client.get("/api/v1/market-data/depth/UNKNOWN")
    assert response.status_code == 404
