from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_create_session_success(client: TestClient):
    payload = {"game_name": "Settlers of Catan"}
    response = client.post("/api/v1/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["game_name"] == "Settlers of Catan"
    assert data["status"] == "active"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_session_empty_name(client: TestClient):
    response = client.post("/api/v1/sessions", json={"game_name": ""})
    assert response.status_code == 422

    response_ws = client.post("/api/v1/sessions", json={"game_name": "   "})
    assert response_ws.status_code == 422


def test_get_session_by_id(client: TestClient):
    # Create session
    res = client.post("/api/v1/sessions", json={"game_name": "Wingspan"})
    session_id = res.json()["id"]

    # Fetch
    response = client.get(f"/api/v1/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert data["game_name"] == "Wingspan"


def test_get_session_not_found(client: TestClient):
    response = client.get("/api/v1/sessions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_list_sessions(client: TestClient):
    client.post("/api/v1/sessions", json={"game_name": "Game A"})
    client.post("/api/v1/sessions", json={"game_name": "Game B"})

    response = client.get("/api/v1/sessions?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_update_session(client: TestClient):
    res = client.post("/api/v1/sessions", json={"game_name": "Azul"})
    session_id = res.json()["id"]

    update_payload = {"game_name": "Azul: Summer Pavilion", "status": "completed"}
    response = client.patch(f"/api/v1/sessions/{session_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["game_name"] == "Azul: Summer Pavilion"
    assert data["status"] == "completed"


def test_delete_session(client: TestClient):
    res = client.post("/api/v1/sessions", json={"game_name": "Terraforming Mars"})
    session_id = res.json()["id"]

    del_res = client.delete(f"/api/v1/sessions/{session_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/sessions/{session_id}")
    assert get_res.status_code == 404
