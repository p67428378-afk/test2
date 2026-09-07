from fastapi.testclient import TestClient


def test_add_player_success(client: TestClient):
    # 1. Create a session
    res_session = client.post("/api/v1/sessions", json={"game_name": "Catan"})
    assert res_session.status_code == 201
    session_id = res_session.json()["id"]

    # 2. Add player
    payload = {"name": "Alice"}
    response = client.post(f"/api/v1/sessions/{session_id}/players", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Alice"
    assert data["session_id"] == session_id
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_add_multiple_players_and_list(client: TestClient):
    """Verifies AC: Users can add multiple players by entering their names and view the player list before scoring begins."""
    res_session = client.post("/api/v1/sessions", json={"game_name": "Ticket to Ride"})
    session_id = res_session.json()["id"]

    # Add Alice and Bob
    res_alice = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Alice"}
    )
    assert res_alice.status_code == 201

    res_bob = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Bob"}
    )
    assert res_bob.status_code == 201

    # List players
    res_list = client.get(f"/api/v1/sessions/{session_id}/players")
    assert res_list.status_code == 200
    players = res_list.json()
    assert len(players) == 2
    names = [p["name"] for p in players]
    assert "Alice" in names
    assert "Bob" in names


def test_add_player_validation_error(client: TestClient):
    res_session = client.post("/api/v1/sessions", json={"game_name": "Carcassonne"})
    session_id = res_session.json()["id"]

    # Empty name
    res_empty = client.post(f"/api/v1/sessions/{session_id}/players", json={"name": ""})
    assert res_empty.status_code == 422

    # Whitespace only
    res_ws = client.post(f"/api/v1/sessions/{session_id}/players", json={"name": "   "})
    assert res_ws.status_code == 422


def test_add_player_session_not_found(client: TestClient):
    fake_session_id = "00000000-0000-0000-0000-000000000000"
    response = client.post(
        f"/api/v1/sessions/{fake_session_id}/players", json={"name": "Dave"}
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_delete_player(client: TestClient):
    res_session = client.post("/api/v1/sessions", json={"game_name": "Pandemic"})
    session_id = res_session.json()["id"]

    res_player = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Eve"}
    )
    player_id = res_player.json()["id"]

    # Delete via session route
    res_del = client.delete(f"/api/v1/sessions/{session_id}/players/{player_id}")
    assert res_del.status_code == 204

    # Verify deleted from player list
    res_list = client.get(f"/api/v1/sessions/{session_id}/players")
    assert len(res_list.json()) == 0
