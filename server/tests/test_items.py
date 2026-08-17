from fastapi import status


def test_report_item(client):
    payload = {
        "name": "Lost Keys",
        "description": "A ring of keys with a red keychain.",
        "category": "Keys",
        "location": "Gym Parking Lot",
        "report_date": "2026-08-15T10:00:00Z",
        "contact_info": "test@example.com",
        "status": "lost",
        "image_urls": ["http://example.com/image1.jpg"],
    }
    response = client.post("/api/v1/items", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Lost Keys"
    assert data["status"] == "lost"
    assert len(data["images"]) == 1
    assert data["images"][0]["image_url"] == "http://example.com/image1.jpg"


def test_report_item_invalid_status(client):
    payload = {
        "name": "Lost Keys",
        "description": "A ring of keys with a red keychain.",
        "category": "Keys",
        "location": "Gym Parking Lot",
        "report_date": "2026-08-15T10:00:00Z",
        "contact_info": "test@example.com",
        "status": "invalid_status",
    }
    response = client.post("/api/v1/items", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_list_items(client):
    # Create a lost item
    client.post(
        "/api/v1/items",
        json={
            "name": "Lost Phone",
            "category": "Electronics",
            "location": "Library",
            "report_date": "2026-08-15T10:00:00Z",
            "contact_info": "test@example.com",
            "status": "lost",
        },
    )
    # Create a found item
    client.post(
        "/api/v1/items",
        json={
            "name": "Found Phone",
            "category": "Electronics",
            "location": "Library",
            "report_date": "2026-08-15T11:00:00Z",
            "contact_info": "test@example.com",
            "status": "found",
        },
    )

    # List all
    response = client.get("/api/v1/items")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 2

    # Filter by status
    response = client.get("/api/v1/items?status=lost")
    data = response.json()
    assert all(item["status"] == "lost" for item in data)


def test_get_item_not_found(client):
    response = client.get(f"/api/v1/items/{import_uuid()}")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def import_uuid():
    import uuid

    return uuid.uuid4()


def test_get_item_matches(client):
    # Create a lost item
    lost_res = client.post(
        "/api/v1/items",
        json={
            "name": "Black iPhone 13",
            "description": "Black iPhone 13 with a blue silicone case.",
            "category": "Electronics",
            "location": "Student Union",
            "report_date": "2026-08-15T10:00:00Z",
            "contact_info": "test@example.com",
            "status": "lost",
        },
    )
    lost_item = lost_res.json()

    # Create a matching found item
    client.post(
        "/api/v1/items",
        json={
            "name": "iPhone 13",
            "description": "Found a black iPhone 13 with blue case.",
            "category": "Electronics",
            "location": "Student Union",
            "report_date": "2026-08-15T11:00:00Z",
            "contact_info": "test@example.com",
            "status": "found",
        },
    )

    # Get matches
    response = client.get(f"/api/v1/items/{lost_item['id']}/matches")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]["score"] > 0.5
    assert data[0]["item"]["name"] == "iPhone 13"
