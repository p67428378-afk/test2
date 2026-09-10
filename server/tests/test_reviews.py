def test_get_reviews_by_place(client):
    places_res = client.get("/api/v1/tourist-places")
    places = places_res.json()
    chembra = next(p for p in places if "Chembra" in p["title"])

    response = client.get(f"/api/v1/reviews?place_id={chembra['id']}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["place_id"] == chembra["id"]


def test_submit_review_success(client):
    places_res = client.get("/api/v1/tourist-places")
    places = places_res.json()
    target_place = places[0]
    initial_count = target_place["review_count"]

    review_payload = {
        "place_id": target_place["id"],
        "user_name": "Traveler Bob",
        "rating": 4,
        "comment": "Great experience and clean facilities.",
    }

    response = client.post("/api/v1/reviews", json=review_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["user_name"] == "Traveler Bob"
    assert data["rating"] == 4
    assert data["place_id"] == target_place["id"]

    # Verify place review_count updated
    updated_place_res = client.get(f"/api/v1/tourist-places/{target_place['id']}")
    assert updated_place_res.status_code == 200
    updated_place = updated_place_res.json()
    assert updated_place["review_count"] == initial_count + 1


def test_submit_review_invalid_rating(client):
    places_res = client.get("/api/v1/tourist-places")
    place_id = places_res.json()[0]["id"]

    invalid_review = {
        "place_id": place_id,
        "user_name": "Test User",
        "rating": 10,  # Invalid: must be <= 5
        "comment": "Invalid rating test",
    }

    response = client.post("/api/v1/reviews", json=invalid_review)
    assert response.status_code == 422


def test_submit_review_place_not_found(client):
    review_payload = {
        "place_id": "non-existent-place-uuid",
        "user_name": "Test User",
        "rating": 5,
        "comment": "Not found test",
    }

    response = client.post("/api/v1/reviews", json=review_payload)
    assert response.status_code == 404
