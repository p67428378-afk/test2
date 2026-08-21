def test_create_card(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Deck for Card"})
    deck_id = deck_resp.json()["id"]

    response = client.post(
        f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["front"] == "Q1"
    assert data["back"] == "A1"
    assert data["deck_id"] == deck_id


def test_create_card_empty_fields(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Deck for Card"})
    deck_id = deck_resp.json()["id"]

    response = client.post(
        f"/api/v1/decks/{deck_id}/cards", json={"front": "", "back": "A1"}
    )
    assert response.status_code == 400

    response = client.post(
        f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": ""}
    )
    assert response.status_code == 400


def test_create_card_deck_not_found(client):
    response = client.post(
        "/api/v1/decks/non-existent-id/cards", json={"front": "Q1", "back": "A1"}
    )
    assert response.status_code == 404


def test_list_cards(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Deck for Card"})
    deck_id = deck_resp.json()["id"]

    client.post(f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"})
    client.post(f"/api/v1/decks/{deck_id}/cards", json={"front": "Q2", "back": "A2"})

    response = client.get(f"/api/v1/decks/{deck_id}/cards")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_update_card(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Deck for Card"})
    deck_id = deck_resp.json()["id"]

    card_resp = client.post(
        f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"}
    )
    card_id = card_resp.json()["id"]

    response = client.put(
        f"/api/v1/cards/{card_id}", json={"front": "New Q", "back": "New A"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["front"] == "New Q"
    assert data["back"] == "New A"


def test_delete_card(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Deck for Card"})
    deck_id = deck_resp.json()["id"]

    card_resp = client.post(
        f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"}
    )
    card_id = card_resp.json()["id"]

    response = client.delete(f"/api/v1/cards/{card_id}")
    assert response.status_code == 204

    # Verify card is deleted
    list_resp = client.get(f"/api/v1/decks/{deck_id}/cards")
    assert len(list_resp.json()) == 0
