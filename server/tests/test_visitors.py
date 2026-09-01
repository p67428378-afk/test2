def test_visitor_registration_success(client):
    payload = {
        "full_name": "Alice Johnson",
        "national_id": "NAT-99112233",
        "email": "alice.j@example.com",
        "phone": "555-4321",
        "address": "789 Pine Road, Cityville",
        "photo_id_url": "https://storage.googleapis.com/bucket/id_alice.jpg",
    }
    response = client.post("/api/v1/visitors/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Alice Johnson"
    assert data["national_id"] == "NAT-99112233"
    assert data["verification_status"] == "PENDING"
    assert "id" in data


def test_visitor_registration_duplicate_national_id(client):
    payload = {
        "full_name": "Alice Duplicate",
        "national_id": "NAT-99112233",
        "email": "alice2@example.com",
        "phone": "555-9999",
        "address": "Somewhere",
        "photo_id_url": "https://example.com/id.jpg",
    }
    response = client.post("/api/v1/visitors/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_get_visitor_profile(client):
    response = client.get("/api/v1/visitors/profile?national_id=NAT-99887766")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["verification_status"] == "VERIFIED"


def test_list_visitors(client):
    response = client.get("/api/v1/visitors")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_visitor_history(client):
    # Retrieve seeded test visitor
    profile_res = client.get("/api/v1/visitors/profile?email=test@example.com")
    assert profile_res.status_code == 200
    visitor_id = profile_res.json()["id"]

    history_res = client.get(f"/api/v1/visitors/{visitor_id}/history")
    assert history_res.status_code == 200
    data = history_res.json()
    assert isinstance(data, list)
