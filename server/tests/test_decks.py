def test_create_deck(client):
    response = client.post(
        "/api/v1/decks", json={"title": "Python Basics", "description": "Learn Python"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Python Basics"
    assert data["description"] == "Learn Python"
    assert "id" in data


def test_create_deck_empty_title(client):
    response = client.post(
        "/api/v1/decks", json={"title": "", "description": "Learn Python"}
    )
    assert response.status_code == 400
    assert "Title cannot be empty" in response.json()["detail"]


def test_list_decks(client):
    client.post("/api/v1/decks", json={"title": "Deck 1"})
    client.post("/api/v1/decks", json={"title": "Deck 2"})
    response = client.get("/api/v1/decks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_get_deck(client):
    create_resp = client.post("/api/v1/decks", json={"title": "Deck to Get"})
    deck_id = create_resp.json()["id"]

    response = client.get(f"/api/v1/decks/{deck_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Deck to Get"


def test_get_deck_not_found(client):
    response = client.get("/api/v1/decks/non-existent-id")
    assert response.status_code == 404


def test_update_deck(client):
    create_resp = client.post("/api/v1/decks", json={"title": "Old Title"})
    deck_id = create_resp.json()["id"]

    response = client.put(
        f"/api/v1/decks/{deck_id}",
        json={"title": "New Title", "description": "New Desc"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Title"
    assert data["description"] == "New Desc"


def test_update_deck_empty_title(client):
    create_resp = client.post("/api/v1/decks", json={"title": "Old Title"})
    deck_id = create_resp.json()["id"]

    response = client.put(f"/api/v1/decks/{deck_id}", json={"title": ""})
    assert response.status_code == 400


def test_delete_deck(client):
    create_resp = client.post("/api/v1/decks", json={"title": "To Delete"})
    deck_id = create_resp.json()["id"]

    response = client.delete(f"/api/v1/decks/{deck_id}")
    assert response.status_code == 204

    get_resp = client.get(f"/api/v1/decks/{deck_id}")
    assert get_resp.status_code == 404
