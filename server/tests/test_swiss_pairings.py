from fastapi.testclient import TestClient


def test_swiss_pairings_even_players(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Swiss Test Even", "total_rounds": 3},
    )
    t_id = t_res.json()["id"]

    # Register 4 players
    players_data = [
        {"full_name": "Alpha", "email": "alpha@test.com", "rating": 2000},
        {"full_name": "Beta", "email": "beta@test.com", "rating": 1900},
        {"full_name": "Gamma", "email": "gamma@test.com", "rating": 1800},
        {"full_name": "Delta", "email": "delta@test.com", "rating": 1700},
    ]
    for p in players_data:
        client.post(f"/api/v1/tournaments/{t_id}/players", json=p)

    # Generate round 1 pairings
    pair_res = client.post(f"/api/v1/tournaments/{t_id}/rounds/pairings")
    assert pair_res.status_code == 201
    round_data = pair_res.json()
    assert round_data["round_number"] == 1
    assert len(round_data["matches"]) == 2
    for m in round_data["matches"]:
        assert m["is_bye"] is False
        assert m["result"] == "PENDING"


def test_swiss_pairings_odd_players_bye_allocation(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Swiss Test Odd", "total_rounds": 3},
    )
    t_id = t_res.json()["id"]

    # Register 3 players (odd count)
    players_data = [
        {"full_name": "P1", "email": "p1@test.com", "rating": 2100},
        {"full_name": "P2", "email": "p2@test.com", "rating": 1900},
        {"full_name": "P3", "email": "p3@test.com", "rating": 1400},
    ]
    for p in players_data:
        client.post(f"/api/v1/tournaments/{t_id}/players", json=p)

    pair_res = client.post(f"/api/v1/tournaments/{t_id}/rounds/pairings")
    assert pair_res.status_code == 201
    round_data = pair_res.json()
    assert round_data["round_number"] == 1
    matches = round_data["matches"]
    assert len(matches) == 2  # 1 regular match + 1 bye

    bye_matches = [m for m in matches if m["is_bye"]]
    assert len(bye_matches) == 1
    bye_m = bye_matches[0]
    assert bye_m["result"] == "BYE"

    # Check standings - bye recipient should have 1.0 point
    standings_res = client.get(f"/api/v1/tournaments/{t_id}/standings")
    assert standings_res.status_code == 200
    standings = standings_res.json()
    # P3 (lowest rating) should receive the bye and have 1.0 total points
    p3_standing = [s for s in standings if s["full_name"] == "P3"][0]
    assert p3_standing["total_points"] == 1.0
