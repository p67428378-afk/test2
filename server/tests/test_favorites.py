import pytest


@pytest.fixture
def auth_headers(client):
    # Register and login to get token
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "favtest@example.com",
            "full_name": "Fav Test User",
            "password": "password123",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "favtest@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_favorites_unauthorized(client):
    response = client.get("/api/v1/favorites")
    assert response.status_code == 401


def test_get_favorites_empty(client, auth_headers):
    response = client.get("/api/v1/favorites", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_create_favorite_by_id(client, auth_headers):
    # Get a quote first
    quote_resp = client.get("/api/v1/quotes/random")
    quote_id = quote_resp.json()["id"]

    # Favorite it
    response = client.post(
        "/api/v1/favorites", json={"quote_id": quote_id}, headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["quote_id"] == quote_id
    assert "id" in data
    assert data["quote"]["id"] == quote_id

    # Verify it is in favorites list
    fav_list_resp = client.get("/api/v1/favorites", headers=auth_headers)
    assert len(fav_list_resp.json()) == 1
    assert fav_list_resp.json()[0]["quote_id"] == quote_id


def test_create_favorite_by_text_author(client, auth_headers):
    response = client.post(
        "/api/v1/favorites",
        json={
            "text": "This is a brand new custom quote.",
            "author": "Custom Author",
            "category": "Inspiration",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["quote"]["text"] == "This is a brand new custom quote."
    assert data["quote"]["author"] == "Custom Author"


def test_create_favorite_duplicate_prevention(client, auth_headers):
    # Get a quote
    quote_resp = client.get("/api/v1/quotes/random")
    quote_id = quote_resp.json()["id"]

    # Favorite first time
    resp1 = client.post(
        "/api/v1/favorites", json={"quote_id": quote_id}, headers=auth_headers
    )
    assert resp1.status_code == 201

    # Favorite second time
    resp2 = client.post(
        "/api/v1/favorites", json={"quote_id": quote_id}, headers=auth_headers
    )
    assert resp2.status_code == 201  # Should return existing favorite
    assert resp1.json()["id"] == resp2.json()["id"]

    # Verify only 1 favorite exists in list
    fav_list_resp = client.get("/api/v1/favorites", headers=auth_headers)
    assert len(fav_list_resp.json()) == 1


def test_delete_favorite(client, auth_headers):
    # Create a favorite
    quote_resp = client.get("/api/v1/quotes/random")
    quote_id = quote_resp.json()["id"]
    fav_resp = client.post(
        "/api/v1/favorites", json={"quote_id": quote_id}, headers=auth_headers
    )
    fav_id = fav_resp.json()["id"]

    # Delete it
    delete_resp = client.delete(f"/api/v1/favorites/{fav_id}", headers=auth_headers)
    assert delete_resp.status_code == 204

    # Verify favorites list is empty again
    fav_list_resp = client.get("/api/v1/favorites", headers=auth_headers)
    assert len(fav_list_resp.json()) == 0
