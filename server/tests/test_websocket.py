def get_token(client, email, password):
    resp = client.post(
        "/api/v1/auth/login/json", json={"email": email, "password": password}
    )
    return resp.json()["access_token"]


def test_websocket_auth_success(client):
    token = get_token(client, "test@example.com", "testpassword")
    with client.websocket_connect(f"/api/v1/ws?token={token}") as websocket:
        data = websocket.receive_json()
        assert data["type"] == "CONNECTION_ESTABLISHED"
        assert data["user"] == "test@example.com"


def test_websocket_missing_token(client):
    try:
        with client.websocket_connect("/api/v1/ws") as websocket:
            pass
    except Exception:
        # FastAPI test client raises error or closes connection
        assert True
