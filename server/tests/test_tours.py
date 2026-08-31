def test_get_tours(client):
    response = client.get("/api/v1/tours")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3


def test_create_and_get_tour(client):
    payload = {
        "title": "Modern Architecture & Sculptures",
        "description": "Guided walking tour through modern glass and bronze installations.",
        "duration_minutes": 45,
    }
    create_res = client.post("/api/v1/tours", json=payload)
    assert create_res.status_code == 201
    tour = create_res.json()
    assert tour["title"] == payload["title"]
    assert tour["duration_minutes"] == 45
    tour_id = tour["id"]

    get_res = client.get(f"/api/v1/tours/{tour_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == tour_id


def test_update_and_delete_tour(client):
    create_res = client.post(
        "/api/v1/tours",
        json={"title": "Temporary Exhibit", "duration_minutes": 30},
    )
    assert create_res.status_code == 201
    tour_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/tours/{tour_id}",
        json={"title": "Updated Exhibit Title", "duration_minutes": 50},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Exhibit Title"

    delete_res = client.delete(f"/api/v1/tours/{tour_id}")
    assert delete_res.status_code == 204

    get_res = client.get(f"/api/v1/tours/{tour_id}")
    assert get_res.status_code == 404
