def get_token(client, email="admin@example.com", password="adminpassword"):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    return res.json()["access_token"]


def test_list_tours(client):
    response = client.get("/api/v1/tours")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "Renaissance Art Tour"


def test_create_tour_admin(client):
    token = get_token(client, "admin@example.com", "adminpassword")
    response = client.post(
        "/api/v1/tours",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Modern Sculpture Tour",
            "description": "Examine contemporary installations.",
            "duration_minutes": 45,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Modern Sculpture Tour"
    assert data["duration_minutes"] == 45


def test_create_tour_visitor_forbidden(client):
    token = get_token(client, "test@example.com", "testpassword")
    response = client.post(
        "/api/v1/tours",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Unauthorized Tour",
            "description": "Should fail.",
            "duration_minutes": 30,
        },
    )
    assert response.status_code == 403
