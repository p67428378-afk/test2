from fastapi import status


def test_admin_list_items(client):
    # Create an item
    client.post(
        "/api/v1/items",
        json={
            "name": "Admin Item",
            "category": "Electronics",
            "location": "Office",
            "report_date": "2026-08-15T10:00:00Z",
            "contact_info": "admin@example.com",
            "status": "lost",
        },
    )

    response = client.get("/api/v1/admin/items")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert any(item["name"] == "Admin Item" for item in data)


def test_admin_list_claims(client):
    # Create an item
    item_res = client.post(
        "/api/v1/items",
        json={
            "name": "Admin Item 2",
            "category": "Electronics",
            "location": "Office",
            "report_date": "2026-08-15T10:00:00Z",
            "contact_info": "admin@example.com",
            "status": "found",
        },
    )
    item = item_res.json()

    # Create a claim
    client.post(
        "/api/v1/claims",
        json={
            "item_id": item["id"],
            "claimant_details": "Claimant Details",
            "claim_date": "2026-08-16T10:00:00Z",
        },
    )

    response = client.get("/api/v1/admin/claims")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert any(claim["claimant_details"] == "Claimant Details" for claim in data)
