def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_boxes_default(client):
    response = client.get("/api/v1/boxes")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 5
    assert len(data["items"]) >= 5

    first_item = data["items"][0]
    assert "id" in first_item
    assert "title" in first_item
    assert "price" in first_item
    assert "category_id" in first_item
    assert "category_name" in first_item
    assert "average_rating" in first_item


def test_filter_boxes_by_category(client):
    # Fetch categories first
    cats = client.get("/api/v1/categories").json()
    beauty_cat = next(c for c in cats if c["slug"] == "beauty-deluxe")

    response = client.get(f"/api/v1/boxes?category_id={beauty_cat['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    for item in data["items"]:
        assert item["category_id"] == beauty_cat["id"]


def test_filter_boxes_by_max_price(client):
    response = client.get("/api/v1/boxes?max_price=30.00")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    for item in data["items"]:
        assert item["price"] <= 30.00


def test_filter_boxes_by_min_rating(client):
    response = client.get("/api/v1/boxes?min_rating=4.8")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    for item in data["items"]:
        assert item["average_rating"] >= 4.8


def test_search_boxes(client):
    response = client.get("/api/v1/boxes?search=Coffee")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("Coffee" in item["title"] for item in data["items"])


def test_pagination(client):
    response = client.get("/api/v1/boxes?skip=0&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["limit"] == 2
    assert data["skip"] == 0


def test_get_box_detail_success(client):
    boxes = client.get("/api/v1/boxes").json()["items"]
    target_box = boxes[0]

    response = client.get(f"/api/v1/boxes/{target_box['id']}")
    assert response.status_code == 200
    detail = response.json()
    assert detail["id"] == target_box["id"]
    assert detail["title"] == target_box["title"]
    assert "curations" in detail
    assert len(detail["curations"]) >= 1
    first_curation = detail["curations"][0]
    assert "month_year" in first_curation
    assert "theme_title" in first_curation
    assert "highlights" in first_curation
    assert "item_list" in first_curation
    assert isinstance(first_curation["item_list"], list)


def test_get_box_detail_not_found(client):
    response = client.get("/api/v1/boxes/non-existent-box-id-12345")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
