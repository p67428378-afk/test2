from datetime import datetime, timezone, timedelta


def test_list_campaigns(client):
    response = client.get("/api/v1/campaigns")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1


def test_search_campaigns(client):
    response = client.get("/api/v1/campaigns?search=Coat")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1
    assert "Coat" in data["items"][0]["title"]


def test_filter_campaigns_by_category(client):
    response = client.get("/api/v1/campaigns?category=Medical")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1
    assert data["items"][0]["category"] == "Medical"


def test_search_campaigns_empty(client):
    response = client.get("/api/v1/campaigns?search=NonExistentCampaignXYZ")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert len(data["items"]) == 0


def test_get_campaign_detail(client):
    list_resp = client.get("/api/v1/campaigns")
    campaign_id = list_resp.json()["items"][0]["id"]

    response = client.get(f"/api/v1/campaigns/{campaign_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == campaign_id
    assert "supporter_count" in data


def test_get_campaign_not_found(client):
    response = client.get("/api/v1/campaigns/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_admin_create_campaign_success(client, admin_headers):
    now = datetime.now(timezone.utc)
    payload = {
        "title": "Scholarship Fund for Kids",
        "description": "Funding education for underprivileged children.",
        "target_amount": 5000.00,
        "category": "Education",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=30)).isoformat(),
        "status": "Active",
    }
    response = client.post("/api/v1/campaigns", json=payload, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Scholarship Fund for Kids"
    assert data["current_amount"] == 0.0


def test_admin_create_campaign_invalid_dates(client, admin_headers):
    now = datetime.now(timezone.utc)
    payload = {
        "title": "Invalid Campaign",
        "description": "End date before start date.",
        "target_amount": 1000.00,
        "category": "Test",
        "start_date": now.isoformat(),
        "end_date": (now - timedelta(days=5)).isoformat(),
    }
    response = client.post("/api/v1/campaigns", json=payload, headers=admin_headers)
    assert response.status_code in [400, 422]


def test_non_admin_cannot_create_campaign(client, donor_headers):
    now = datetime.now(timezone.utc)
    payload = {
        "title": "Unauthorized Campaign",
        "description": "Donor trying to create.",
        "target_amount": 1000.00,
        "category": "Test",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=10)).isoformat(),
    }
    response = client.post("/api/v1/campaigns", json=payload, headers=donor_headers)
    assert response.status_code == 403


def test_admin_update_campaign(client, admin_headers):
    list_resp = client.get("/api/v1/campaigns")
    campaign_id = list_resp.json()["items"][0]["id"]

    response = client.put(
        f"/api/v1/campaigns/{campaign_id}",
        json={"status": "Paused"},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Paused"


def test_admin_delete_campaign(client, admin_headers):
    now = datetime.now(timezone.utc)
    create_resp = client.post(
        "/api/v1/campaigns",
        json={
            "title": "To Be Deleted",
            "description": "Test delete",
            "target_amount": 100.00,
            "category": "Test",
            "start_date": now.isoformat(),
            "end_date": (now + timedelta(days=1)).isoformat(),
        },
        headers=admin_headers,
    )
    cid = create_resp.json()["id"]

    del_resp = client.delete(f"/api/v1/campaigns/{cid}", headers=admin_headers)
    assert del_resp.status_code == 204

    get_resp = client.get(f"/api/v1/campaigns/{cid}")
    assert get_resp.status_code == 404
