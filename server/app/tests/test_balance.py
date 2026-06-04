from fastapi.testclient import TestClient

from server.app.main import app

client = TestClient(app)

def test_balance_inquiry_success():
    response = client.post("/api/v1/balance-inquiry", json={"account_number": "1234567890", "otp": "987654"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "BALANCE_DETAILS"
    assert data["available_balance"] == "1500.00"
    assert data["ledger_balance"] == "1600.00"
    assert data["currency"] == "USD"

def test_balance_inquiry_invalid_otp():
    response = client.post("/api/v1/balance-inquiry", json={"account_number": "1234567890", "otp": "111111"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid OTP provided."}
