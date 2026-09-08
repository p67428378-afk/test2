def test_get_boxes(client):
    response = client.get("/api/v1/boxes")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 3
    assert len(data["items"]) >= 3
    item = data["items"][0]
    assert "id" in item
    assert "title" in item
    assert "slug" in item
    assert "price" in item
    assert "billing_frequency" in item


def test_get_boxes_filter_by_category(client):
    cats_res = client.get("/api/v1/categories")
    cats = cats_res.json()
    cat_id = cats[0]["id"]

    response = client.get(f"/api/v1/boxes?category_id={cat_id}")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["category_id"] == cat_id


def test_get_boxes_filter_by_price(client):
    response = client.get("/api/v1/boxes?max_price=35.0")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["price"] <= 35.0


def test_get_boxes_filter_by_rating(client):
    response = client.get("/api/v1/boxes?min_rating=4.5")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["average_rating"] >= 4.5


def test_get_boxes_search(client):
    response = client.get("/api/v1/boxes?search=Beauty")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1
    assert "Beauty" in data["items"][0]["title"]


def test_get_box_detail(client):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    box = boxes[0]

    # By ID
    response = client.get(f"/api/v1/boxes/{box['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == box["id"]
    assert data["title"] == box["title"]
    assert "curations" in data
    assert len(data["curations"]) >= 1
    assert "reviews" in data

    # By Slug
    slug_response = client.get(f"/api/v1/boxes/{box['slug']}")
    assert slug_response.status_code == 200
    assert slug_response.json()["id"] == box["id"]


def test_get_box_detail_not_found(client):
    response = client.get("/api/v1/boxes/non-existent-box-id")
    assert response.status_code == 404


# ---------------- Gift Subscription Tests ----------------
def test_create_gift_subscription_success(client):
    boxes_res = client.get("/api/v1/boxes")
    box_id = boxes_res.json()["items"][0]["id"]

    response = client.post(
        f"/api/v1/boxes/{box_id}/gift",
        json={
            "recipient_email": "friend@example.com",
            "message": "Happy Birthday! Enjoy this amazing subscription box curation!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["box_id"] == box_id
    assert data["recipient_email"] == "friend@example.com"
    assert "Happy Birthday" in data["message"]
    assert data["status"] == "pending"
    assert "id" in data


def test_create_gift_subscription_invalid_email(client):
    boxes_res = client.get("/api/v1/boxes")
    box_id = boxes_res.json()["items"][0]["id"]

    response = client.post(
        f"/api/v1/boxes/{box_id}/gift",
        json={
            "recipient_email": "not-an-email",
            "message": "Test gift",
        },
    )
    assert response.status_code in [400, 422]


def test_create_gift_subscription_box_not_found(client):
    response = client.post(
        "/api/v1/boxes/non-existent-box-id/gift",
        json={
            "recipient_email": "friend@example.com",
            "message": "Gift message",
        },
    )
    assert response.status_code == 404


# ---------------- Customization Tests ----------------
def test_get_box_customizations_success(client):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    # Find Beauty Deluxe Box which has replacements defined
    beauty_box = next((b for b in boxes if "beauty" in b["slug"]), boxes[0])

    response = client.get(f"/api/v1/boxes/{beauty_box['id']}/customizations")
    assert response.status_code == 200
    data = response.json()
    assert data["box_id"] == beauty_box["id"]
    assert data["max_swaps_allowed"] == 1
    assert "curation_id" in data
    assert "current_items" in data
    assert len(data["current_items"]) > 0
    assert "available_replacements" in data
    assert len(data["available_replacements"]) > 0


def test_get_box_customizations_box_not_found(client):
    response = client.get("/api/v1/boxes/non-existent-box-id/customizations")
    assert response.status_code == 404


def test_submit_box_customization_success(client):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    beauty_box = next((b for b in boxes if "beauty" in b["slug"]), boxes[0])

    # Fetch customizations options first
    opt_res = client.get(f"/api/v1/boxes/{beauty_box['id']}/customizations")
    options = opt_res.json()
    current_item = options["current_items"][0]
    replacement = options["available_replacements"][0]

    response = client.post(
        f"/api/v1/boxes/{beauty_box['id']}/customizations",
        json={
            "original_item_id": current_item["id"],
            "replacement_item_id": replacement["id"],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["box_id"] == beauty_box["id"]
    assert data["curation_id"] == options["curation_id"]
    assert data["original_item_id"] == current_item["id"]
    assert data["replacement_item_id"] == replacement["id"]
    assert data["status"] == "confirmed"


def test_submit_box_customization_invalid_original_item(client):
    boxes_res = client.get("/api/v1/boxes")
    beauty_box = boxes_res.json()["items"][0]

    response = client.post(
        f"/api/v1/boxes/{beauty_box['id']}/customizations",
        json={
            "original_item_id": "non-existent-item-999",
            "replacement_item_id": "rep-1",
        },
    )
    assert response.status_code == 400
    assert "not in this curation" in response.json()["detail"]


def test_submit_box_customization_invalid_replacement_item(client):
    boxes_res = client.get("/api/v1/boxes")
    boxes = boxes_res.json()["items"]
    beauty_box = next((b for b in boxes if "beauty" in b["slug"]), boxes[0])

    response = client.post(
        f"/api/v1/boxes/{beauty_box['id']}/customizations",
        json={
            "original_item_id": "item-1",
            "replacement_item_id": "invalid-replacement-id",
        },
    )
    assert response.status_code == 400
    assert "not an eligible option" in response.json()["detail"]
