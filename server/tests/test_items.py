def test_report_lost_item_success(client, user_token):
    # AC: Item Reporting (Lost and Found) - Happy Path
    payload = {
        "type": "lost",
        "category": "Electronics",
        "name": "iPhone 15",
        "description": "Black iPhone 15 with a cracked screen protector",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "test@example.com",
        "images": [
            {"image_url": "https://example.com/iphone.png", "file_size_mb": 1.5}
        ],
    }
    response = client.post(
        "/api/v1/items", json=payload, headers={"Authorization": f"Bearer {user_token}"}
    )
    print("RESPONSE JSON:", response.json())
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "iPhone 15"
    assert data["status"] == "unclaimed"
    assert len(data["images"]) == 1


def test_report_item_missing_required_fields(client, user_token):
    # AC: Item Reporting (Lost and Found) - Edge Case: Missing required fields
    payload = {
        "type": "lost",
        "category": "",  # Missing category
        "name": "iPhone 15",
        "description": "Black iPhone 15",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "test@example.com",
    }
    response = client.post(
        "/api/v1/items", json=payload, headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 422


def test_report_item_image_size_exceeded(client, user_token):
    # AC: Item Reporting (Lost and Found) - Edge Case: Image size exceeds 5MB
    payload = {
        "type": "lost",
        "category": "Electronics",
        "name": "iPhone 15",
        "description": "Black iPhone 15",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "test@example.com",
        "images": [
            {
                "image_url": "https://example.com/iphone.png",
                "file_size_mb": 6.2,
            }  # Exceeds 5MB
        ],
    }
    response = client.post(
        "/api/v1/items", json=payload, headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 400
    assert "Image upload exceeds size limit of 5MB" in response.json()["detail"]


def test_list_items(client):
    # AC: Item Reporting (Lost and Found) - List items with pagination
    response = client.get("/api/v1/items?skip=0&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
