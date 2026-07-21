import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect


def test_websocket_unauthorized(client: TestClient):
    with pytest.raises(WebSocketDisconnect) as exc_info:
        with client.websocket_connect("/ws/worklist") as websocket:
            websocket.receive_text()
    assert exc_info.value.code == 1008


def test_websocket_authorized(client: TestClient):
    # Get token
    response = client.post(
        "/api/v1/auth/token", json={"username": "testuser", "password": "testpassword"}
    )
    token = response.json()["access_token"]

    with client.websocket_connect(f"/ws/worklist?token={token}"):
        # Connection should succeed
        pass
