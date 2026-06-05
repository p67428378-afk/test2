
from fastapi.testclient import TestClient
from server.main import app
import uuid

client = TestClient(app)

def test_read_positions():
    # This test depends on the trader_id existing in the database.
    # For this example, we'll assume the trader_id from the endpoint is valid.
    trader_id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    response = client.get(f"/api/v1/positions/{trader_id}")
    assert response.status_code == 200
    # The response should be a list, even if it's empty.
    assert isinstance(response.json(), list)
