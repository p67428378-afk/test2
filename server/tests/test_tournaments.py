from fastapi.testclient import TestClient


def test_create_tournament(client: TestClient):
    response = client.post(
        "/api/v1/tournaments",
        json={"name": "Grandmaster Masters 2026", "total_rounds": 5},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Grandmaster Masters 2026"
    assert data["total_rounds"] == 5
    assert data["status"] == "DRAFT"
    assert "id" in data


def test_list_and_get_tournament(client: TestClient):
    create_res = client.post(
        "/api/v1/tournaments",
        json={"name": "Spring Chess Open", "total_rounds": 3},
    )
    t_id = create_res.json()["id"]

    list_res = client.get("/api/v1/tournaments")
    assert list_res.status_code == 200
    tournaments = list_res.json()
    assert len(tournaments) >= 1

    get_res = client.get(f"/api/v1/tournaments/{t_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Spring Chess Open"
