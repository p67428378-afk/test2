def test_get_box_reviews(client):
    boxes_res = client.get("/api/v1/boxes")
    assert boxes_res.status_code == 200
    boxes = boxes_res.json()["items"]
    assert len(boxes) > 0
    box_id = boxes[0]["id"]

    response = client.get(f"/api/v1/boxes/{box_id}/reviews")
    assert response.status_code == 200
    data = response.json()
    assert "reviews" in data
    assert "total" in data
    assert isinstance(data["reviews"], list)


def test_get_reviews_box_not_found(client):
    response = client.get("/api/v1/boxes/non-existent-box-id/reviews")
    assert response.status_code == 404


def test_submit_review_authenticated(client, auth_headers):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    box_id = boxes[0]["id"]

    response = client.post(
        f"/api/v1/boxes/{box_id}/reviews",
        headers=auth_headers,
        json={
            "rating": 5,
            "comment": "Outstanding selection of products! Highly recommended.",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["box_id"] == box_id
    assert data["rating"] == 5
    assert data["comment"] == "Outstanding selection of products! Highly recommended."
    assert data["user_email"] == "test@example.com"


def test_submit_review_unauthenticated(client):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    box_id = boxes[0]["id"]

    response = client.post(
        f"/api/v1/boxes/{box_id}/reviews",
        json={"rating": 4, "comment": "Nice box"},
    )
    assert response.status_code == 401


def test_submit_review_invalid_rating(client, auth_headers):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    box_id = boxes[0]["id"]

    response = client.post(
        f"/api/v1/boxes/{box_id}/reviews",
        headers=auth_headers,
        json={"rating": 6, "comment": "Invalid high rating"},
    )
    assert response.status_code in [400, 422]
