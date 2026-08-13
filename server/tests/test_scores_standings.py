from fastapi.testclient import TestClient


def test_score_submission_and_tiebreaks(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Score Tiebreak Test", "total_rounds": 2},
    )
    t_id = t_res.json()["id"]

    # Register 4 players
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "A", "email": "a@t.com", "rating": 2000},
    )
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "B", "email": "b@t.com", "rating": 1900},
    )
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "C", "email": "c@t.com", "rating": 1800},
    )
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "D", "email": "d@t.com", "rating": 1700},
    )

    # Generate Round 1
    r1 = client.post(f"/api/v1/tournaments/{t_id}/rounds/pairings").json()
    matches_r1 = r1["matches"]

    # Submit R1 results:
    # Match 1: White (A) wins vs Black (B) -> "1-0"
    m1 = matches_r1[0]
    client.post("/api/v1/scores", json={"match_id": m1["id"], "result": "1-0"})

    # Match 2: White (C) draws vs Black (D) -> "0.5-0.5"
    m2 = matches_r1[1]
    client.post("/api/v1/scores", json={"match_id": m2["id"], "result": "0.5-0.5"})

    # Check standings after Round 1
    st_res = client.get(f"/api/v1/tournaments/{t_id}/standings")
    assert st_res.status_code == 200
    st = st_res.json()
    assert len(st) == 4

    # The winner of M1 should be rank #1 with 1.0 point
    top_player = st[0]
    assert top_player["total_points"] == 1.0
    assert top_player["rank"] == 1


def test_score_modification_and_override_audit(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Override Audit Test", "total_rounds": 2},
    )
    t_id = t_res.json()["id"]

    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "P1", "email": "p1@audit.com", "rating": 1500},
    )
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "P2", "email": "p2@audit.com", "rating": 1500},
    )

    r1 = client.post(f"/api/v1/tournaments/{t_id}/rounds/pairings").json()
    m_id = r1["matches"][0]["id"]

    # Initial submission: 1-0
    client.post("/api/v1/scores", json={"match_id": m_id, "result": "1-0"})

    # Organizer override modification: 0.5-0.5
    override_res = client.post(
        "/api/v1/scores", json={"match_id": m_id, "result": "0.5-0.5"}
    )
    assert override_res.status_code == 200
    assert override_res.json()["result"] == "0.5-0.5"
