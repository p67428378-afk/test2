"""Unit and integration tests for Guide management APIs."""


def test_list_guides(client):
    """Test retrieving list of registered tour guides."""
    response = client.get("/api/v1/guides")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "email" in data[0]
    assert "specialization" in data[0]


def test_create_guide(client):
    """Test registering a new guide."""
    payload = {
        "name": "Sarah Connor",
        "email": "sarah.connor@museum.org",
        "specialization": "Contemporary Asian Art",
    }
    response = client.post("/api/v1/guides", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_create_duplicate_guide_email(client):
    """Test duplicate email rejection (HTTP 400)."""
    payload = {
        "name": "Original Guide",
        "email": "duplicate.test@museum.org",
        "specialization": "History",
    }
    res1 = client.post("/api/v1/guides", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/guides", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_get_guide_by_id(client):
    """Test getting a guide by ID."""
    create_res = client.post(
        "/api/v1/guides",
        json={
            "name": "Marcus Aurelius",
            "email": "marcus.aurelius@museum.org",
            "specialization": "Stoic Philosophy & Antiquities",
        },
    )
    assert create_res.status_code == 201
    guide_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/guides/{guide_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Marcus Aurelius"


def test_get_nonexistent_guide(client):
    """Test 404 for nonexistent guide."""
    response = client.get("/api/v1/guides/non-existent-guide-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Guide not found"
