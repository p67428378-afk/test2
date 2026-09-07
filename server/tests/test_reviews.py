def test_get_box_reviews_success(client):
    boxes = client.get("/api/v1/boxes").json()["items"]
    target_box = next(b for b in boxes if b["slug"] == "gourmet-foodies-club")

    response = client.get(f"/api/v1/boxes/{target_box['id']}/reviews")
    assert response.status_code == 200
    data = response.json()
    assert "reviews" in data
    assert "total" in data
    assert data["total"] >= 2

    first_review = data["reviews"][0]
    assert "id" in first_review
    assert "rating" in first_review
    assert "comment" in first_review
    assert "user_name" in first_review


def test_get_box_reviews_not_found(client):
    response = client.get("/api/v1/boxes/invalid-box-id/reviews")
    assert response.status_code == 404


def test_submit_review_unauthenticated(client):
    boxes = client.get("/api/v1/boxes").json()["items"]
    target_box = boxes[0]

    payload = {"rating": 5, "comment": "Outstanding curation!"}
    response = client.post(f"/api/v1/boxes/{target_box['id']}/reviews", json=payload)
    assert response.status_code == 401


def test_submit_review_invalid_rating(client, auth_headers):
    boxes = client.get("/api/v1/boxes").json()["items"]
    target_box = boxes[0]

    payload = {
        "rating": 6,  # Invalid: must be 1-5
        "comment": "Too high rating",
    }
    response = client.post(
        f"/api/v1/boxes/{target_box['id']}/reviews", json=payload, headers=auth_headers
    )
    assert response.status_code == 422 or response.status_code == 400


def test_submit_review_success_and_updates_aggregate(client, admin_auth_headers):
    boxes = client.get("/api/v1/boxes").json()["items"]
    target_box = next(b for b in boxes if b["slug"] == "bookworm-page-turner")
    initial_reviews_count = target_box["total_reviews"]

    payload = {
        "rating": 4,
        "comment": "Loved the secret library theme and custom bookmark!",
    }
    response = client.post(
        f"/api/v1/boxes/{target_box['id']}/reviews",
        json=payload,
        headers=admin_auth_headers,
    )
    assert response.status_code == 201
    review_data = response.json()
    assert review_data["rating"] == 4
    assert review_data["comment"] == payload["comment"]

    # Verify updated box detail has the new total and recalculated average
    box_detail = client.get(f"/api/v1/boxes/{target_box['id']}").json()
    assert box_detail["total_reviews"] >= initial_reviews_count + 1
    assert 1.0 <= box_detail["average_rating"] <= 5.0
