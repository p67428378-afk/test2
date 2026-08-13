from fastapi.testclient import TestClient


def test_register_player_and_default_rating(client: TestClient):
    # Create tournament
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "City Championship", "total_rounds": 5},
    )
    t_id = t_res.json()["id"]

    # Register rated player
    p1_res = client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={
            "full_name": "Magnus Carlsen",
            "email": "magnus@example.com",
            "rating": 2850,
            "fide_id": "1500015",
        },
    )
    assert p1_res.status_code == 201
    assert p1_res.json()["rating"] == 2850

    # Register unrated player (default 1200)
    p2_res = client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={
            "full_name": "New Player",
            "email": "newbie@example.com",
        },
    )
    assert p2_res.status_code == 201
    assert p2_res.json()["rating"] == 1200


def test_register_duplicate_email_in_same_tournament(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Regional Open", "total_rounds": 5},
    )
    t_id = t_res.json()["id"]

    p_data = {
        "full_name": "Hikaru Nakamura",
        "email": "hikaru@example.com",
        "rating": 2780,
    }

    res1 = client.post(f"/api/v1/tournaments/{t_id}/players", json=p_data)
    assert res1.status_code == 201

    res2 = client.post(f"/api/v1/tournaments/{t_id}/players", json=p_data)
    assert res2.status_code == 400
    assert "Player email already registered in this tournament" in res2.json()["detail"]


def test_get_tournament_roster(client: TestClient):
    t_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Club League", "total_rounds": 3},
    )
    t_id = t_res.json()["id"]

    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "Player One", "email": "p1@example.com", "rating": 1500},
    )
    client.post(
        f"/api/v1/tournaments/{t_id}/players",
        json={"full_name": "Player Two", "email": "p2@example.com", "rating": 1600},
    )

    roster_res = client.get(f"/api/v1/tournaments/{t_id}/players")
    assert roster_res.status_code == 200
    roster = roster_res.json()
    assert len(roster) == 2
    emails = [p["email"] for p in roster]
    assert "p1@example.com" in emails
    assert "p2@example.com" in emails
