def test_create_tour(client):
    # AC1: Administrators can create, update, and publish tour routes
    payload = {
        "title": "Impressionist Highlights",
        "description": "Monet, Renoir, and Degas masterpieces.",
        "duration_minutes": 75,
    }
    response = client.post("/api/v1/tours", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["duration_minutes"] == 75
    assert "id" in data


def test_list_tours(client):
    # AC1: Listing tour routes
    client.post(
        "/api/v1/tours",
        json={"title": "Tour 1", "description": "Desc 1", "duration_minutes": 60},
    )
    client.post(
        "/api/v1/tours",
        json={"title": "Tour 2", "description": "Desc 2", "duration_minutes": 90},
    )

    response = client.get("/api/v1/tours")
    assert response.status_code == 200
    tours = response.json()
    assert len(tours) >= 2


def test_get_tour_by_id(client):
    # AC1: Get single tour
    create_res = client.post(
        "/api/v1/tours",
        json={
            "title": "Egyptian Wing",
            "description": "Mummies",
            "duration_minutes": 60,
        },
    )
    tour_id = create_res.json()["id"]

    response = client.get(f"/api/v1/tours/{tour_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Egyptian Wing"


def test_get_tour_not_found(client):
    response = client.get("/api/v1/tours/non-existent-id")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_tour(client):
    # AC1: Update tour route
    create_res = client.post(
        "/api/v1/tours",
        json={"title": "Old Title", "description": "Old Desc", "duration_minutes": 45},
    )
    tour_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/tours/{tour_id}",
        json={"title": "New Updated Title", "duration_minutes": 60},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "New Updated Title"
    assert update_res.json()["duration_minutes"] == 60


def test_delete_tour(client):
    create_res = client.post(
        "/api/v1/tours",
        json={
            "title": "Temp Tour",
            "description": "To be deleted",
            "duration_minutes": 30,
        },
    )
    tour_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/tours/{tour_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/tours/{tour_id}")
    assert get_res.status_code == 404
