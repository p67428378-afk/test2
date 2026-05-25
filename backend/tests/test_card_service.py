
from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas import BlockCardRequest, CardIdentifier, BlockCardResponse
from backend.models import BlockingStatus

client = TestClient(app)

def test_block_card_with_valid_otp():
    request = BlockCardRequest(
        identifier=CardIdentifier(card_number="1234-5678-9012-3456"),
        otp="123456"
    )
    response = client.post("/api/v1/cards/block", json=request.dict())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == BlockingStatus.BLOCKED.value
    assert "reference_number" in data

def test_block_card_with_invalid_otp():
    request = BlockCardRequest(
        identifier=CardIdentifier(card_number="1234-5678-9012-3456"),
        otp="654321"
    )
    response = client.post("/api/v1/cards/block", json=request.dict())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == BlockingStatus.FAILED.value
    assert "reference_number" in data

def test_block_card_with_account_number():
    request = BlockCardRequest(
        identifier=CardIdentifier(account_number="9876543210"),
        otp="123456"
    )
    response = client.post("/api/v1/cards/block", json=request.dict())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == BlockingStatus.BLOCKED.value
    assert "reference_number" in data
