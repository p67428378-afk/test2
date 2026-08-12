def test_websocket_live_trains(client):
    with client.websocket_connect("/api/v1/ws/trains/live") as websocket:
        initial_data = websocket.receive_json()
        assert initial_data["event"] == "initial_state"
        assert "trains" in initial_data
        assert isinstance(initial_data["trains"], list)
        assert len(initial_data["trains"]) >= 1

        websocket.send_text("ping")
        response = websocket.receive_text()
        assert response == "pong"
