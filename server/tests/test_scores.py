from fastapi.testclient import TestClient


def test_submit_score_and_tally(client: TestClient):
    """Verifies AC: Users can input scores/points for each player across categories or round totals,
    and the system automatically calculates and displays the final total points for each player."""
    # 1. Create session
    res_session = client.post(
        "/api/v1/sessions", json={"game_name": "Catan Championship"}
    )
    session_id = res_session.json()["id"]

    # 2. Add Alice and Bob
    res_alice = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Alice"}
    )
    alice_id = res_alice.json()["id"]

    res_bob = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Bob"}
    )
    bob_id = res_bob.json()["id"]

    # 3. Enter 15 points for Alice and 20 points for Bob
    score_alice = {
        "player_id": alice_id,
        "points": 15.0,
        "round_or_category": "Round 1",
    }
    res_sa = client.post(f"/api/v1/sessions/{session_id}/scores", json=score_alice)
    assert res_sa.status_code == 201
    assert res_sa.json()["points"] == 15.0

    score_bob = {"player_id": bob_id, "points": 20.0, "round_or_category": "Round 1"}
    res_sb = client.post(f"/api/v1/sessions/{session_id}/scores", json=score_bob)
    assert res_sb.status_code == 201
    assert res_sb.json()["points"] == 20.0

    # 4. Check leaderboard & tally
    res_lb = client.get(f"/api/v1/sessions/{session_id}/leaderboard")
    assert res_lb.status_code == 200
    lb_data = res_lb.json()

    assert lb_data["session_id"] == session_id
    assert lb_data["game_name"] == "Catan Championship"
    assert len(lb_data["ranked_players"]) == 2

    # Bob should be 1st with 20 points, Alice 2nd with 15 points
    p1 = lb_data["ranked_players"][0]
    p2 = lb_data["ranked_players"][1]

    assert p1["name"] == "Bob"
    assert p1["total_score"] == 20.0
    assert p1["rank"] == 1
    assert p1["is_winner"] is True

    assert p2["name"] == "Alice"
    assert p2["total_score"] == 15.0
    assert p2["rank"] == 2
    assert p2["is_winner"] is False

    # Winners list should contain Bob
    assert len(lb_data["winners"]) == 1
    assert lb_data["winners"][0]["name"] == "Bob"
    assert lb_data["winners"][0]["total_score"] == 20.0


def test_multiple_rounds_cumulative_tally(client: TestClient):
    """Test score aggregation over multiple rounds."""
    res_session = client.post("/api/v1/sessions", json={"game_name": "7 Wonders"})
    session_id = res_session.json()["id"]

    res_charlie = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Charlie"}
    )
    charlie_id = res_charlie.json()["id"]

    # Round 1: 10 points
    client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": charlie_id, "points": 10.0, "round_or_category": "Age I"},
    )
    # Round 2: 15 points
    client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": charlie_id, "points": 15.0, "round_or_category": "Age II"},
    )
    # Round 3: 25 points
    client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": charlie_id, "points": 25.0, "round_or_category": "Age III"},
    )

    res_lb = client.get(f"/api/v1/sessions/{session_id}/leaderboard")
    assert res_lb.status_code == 200
    ranked = res_lb.json()["ranked_players"]
    assert len(ranked) == 1
    assert ranked[0]["name"] == "Charlie"
    assert ranked[0]["total_score"] == 50.0
    assert ranked[0]["is_winner"] is True


def test_co_winner_tie_breaker(client: TestClient):
    """Verifies AC/Business Rule: Multiple players with equal highest score share the winner position."""
    res_session = client.post("/api/v1/sessions", json={"game_name": "Splendor"})
    session_id = res_session.json()["id"]

    res_alice = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Alice"}
    )
    res_bob = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Bob"}
    )
    res_charlie = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Charlie"}
    )

    alice_id = res_alice.json()["id"]
    bob_id = res_bob.json()["id"]
    charlie_id = res_charlie.json()["id"]

    # Alice = 15, Bob = 15, Charlie = 10
    client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": alice_id, "points": 15.0},
    )
    client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": bob_id, "points": 15.0},
    )
    client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": charlie_id, "points": 10.0},
    )

    res_lb = client.get(f"/api/v1/sessions/{session_id}/leaderboard")
    assert res_lb.status_code == 200
    lb_data = res_lb.json()

    # Alice and Bob should both be winners
    winners = lb_data["winners"]
    assert len(winners) == 2
    winner_names = [w["name"] for w in winners]
    assert "Alice" in winner_names
    assert "Bob" in winner_names

    # Check ranked players
    ranked = lb_data["ranked_players"]
    assert ranked[0]["rank"] == 1
    assert ranked[0]["is_winner"] is True
    assert ranked[1]["rank"] == 1
    assert ranked[1]["is_winner"] is True
    assert ranked[2]["name"] == "Charlie"
    assert ranked[2]["rank"] == 3
    assert ranked[2]["is_winner"] is False


def test_submit_score_validation_error(client: TestClient):
    res_session = client.post("/api/v1/sessions", json={"game_name": "Clue"})
    session_id = res_session.json()["id"]

    # Non-numeric score
    res_invalid = client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": "fake-player-id", "points": "one-hundred"},
    )
    assert res_invalid.status_code == 422


def test_submit_score_non_existent_player_or_session(client: TestClient):
    fake_session_id = "00000000-0000-0000-0000-000000000000"
    fake_player_id = "00000000-0000-0000-0000-000000000001"

    # Score on fake session
    res_fake_session = client.post(
        f"/api/v1/sessions/{fake_session_id}/scores",
        json={"player_id": fake_player_id, "points": 10.0},
    )
    assert res_fake_session.status_code == 404

    # Score with fake player on real session
    res_session = client.post("/api/v1/sessions", json={"game_name": "Monopoly"})
    session_id = res_session.json()["id"]

    res_fake_player = client.post(
        f"/api/v1/sessions/{session_id}/scores",
        json={"player_id": fake_player_id, "points": 10.0},
    )
    assert res_fake_player.status_code == 404


def test_delete_score_entry(client: TestClient):
    res_session = client.post("/api/v1/sessions", json={"game_name": "Codenames"})
    session_id = res_session.json()["id"]

    res_p = client.post(
        f"/api/v1/sessions/{session_id}/players", json={"name": "Alice"}
    )
    p_id = res_p.json()["id"]

    res_s = client.post(
        f"/api/v1/sessions/{session_id}/scores", json={"player_id": p_id, "points": 5.0}
    )
    s_id = res_s.json()["id"]

    res_del = client.delete(f"/api/v1/scores/{s_id}")
    assert res_del.status_code == 204

    res_del_again = client.delete(f"/api/v1/scores/{s_id}")
    assert res_del_again.status_code == 404
