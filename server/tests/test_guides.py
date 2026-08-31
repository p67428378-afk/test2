def test_get_guides(client):
    response = client.get("/api/v1/guides")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3


def test_create_and_get_guide(client):
    payload = {
        "name": "David Miller",
        "email": "david.miller@museum.org",
        "specialization": "Medieval Weapons & Armor",
    }
    create_res = client.post("/api/v1/guides", json=payload)
    assert create_res.status_code == 201
    guide = create_res.json()
    assert guide["name"] == payload["name"]
    assert guide["email"] == payload["email"]
    guide_id = guide["id"]

    get_res = client.get(f"/api/v1/guides/{guide_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "David Miller"


def test_duplicate_guide_email_rejected(client):
    payload = {
        "name": "Alice Duplicate",
        "email": "alice.smith@museum.org",  # already in seeded data
    }
    create_res = client.post("/api/v1/guides", json=payload)
    assert create_res.status_code == 400


def test_guide_metrics_zero_reviews(client):
    # David Miller has 0 reviews
    payload = {
        "name": "Elena Rostova",
        "email": "elena.rostova@museum.org",
        "specialization": "Impressionism",
    }
    create_res = client.post("/api/v1/guides", json=payload)
    assert create_res.status_code == 201
    guide_id = create_res.json()["id"]

    metrics_res = client.get(f"/api/v1/guides/{guide_id}/metrics")
    assert metrics_res.status_code == 200
    data = metrics_res.json()
    assert data["guide_id"] == guide_id
    assert data["total_reviews"] == 0
    assert data["average_rating"] == 0.0
    assert data["rating_breakdown"]["5_star"] == 0
    assert data["recent_comments"] == []
