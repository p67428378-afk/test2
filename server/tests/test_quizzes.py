def test_start_quiz(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Quiz Deck"})
    deck_id = deck_resp.json()["id"]

    # Add a card
    client.post(f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"})

    response = client.post("/api/v1/quizzes", json={"deck_id": deck_id})
    assert response.status_code == 200
    data = response.json()
    assert "quiz_id" in data
    assert data["deck_id"] == deck_id
    assert data["total_cards"] == 1
    assert len(data["cards"]) == 1
    assert data["cards"][0]["front"] == "Q1"


def test_start_quiz_empty_deck(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Empty Deck"})
    deck_id = deck_resp.json()["id"]

    response = client.post("/api/v1/quizzes", json={"deck_id": deck_id})
    assert response.status_code == 400
    assert "empty deck" in response.json()["detail"]


def test_start_quiz_deck_not_found(client):
    response = client.post("/api/v1/quizzes", json={"deck_id": "non-existent-id"})
    assert response.status_code == 404


def test_submit_quiz(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Quiz Deck"})
    deck_id = deck_resp.json()["id"]
    client.post(f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"})

    start_resp = client.post("/api/v1/quizzes", json={"deck_id": deck_id})
    quiz_id = start_resp.json()["quiz_id"]

    response = client.post(
        f"/api/v1/quizzes/{quiz_id}/submit", json={"score": 1, "total_cards": 1}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == quiz_id
    assert data["score"] == 1
    assert data["total_cards"] == 1
    assert "completed_at" in data


def test_submit_quiz_invalid_score(client):
    deck_resp = client.post("/api/v1/decks", json={"title": "Quiz Deck"})
    deck_id = deck_resp.json()["id"]
    client.post(f"/api/v1/decks/{deck_id}/cards", json={"front": "Q1", "back": "A1"})

    start_resp = client.post("/api/v1/quizzes", json={"deck_id": deck_id})
    quiz_id = start_resp.json()["quiz_id"]

    # Score exceeds total cards
    response = client.post(
        f"/api/v1/quizzes/{quiz_id}/submit", json={"score": 2, "total_cards": 1}
    )
    assert response.status_code == 400

    # Negative score
    response = client.post(
        f"/api/v1/quizzes/{quiz_id}/submit", json={"score": -1, "total_cards": 1}
    )
    assert response.status_code == 400


def test_submit_quiz_not_found(client):
    response = client.post(
        "/api/v1/quizzes/non-existent-id/submit", json={"score": 1, "total_cards": 1}
    )
    assert response.status_code == 404
