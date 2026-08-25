import pytest
from server.app.models.film import Film
from server.app.models.user import User
from server.app.database import get_password_hash


@pytest.fixture
def auth_headers(client, db_session):
    # Register and login a test user
    email = "test@example.com"
    password = "testpassword"
    hashed_pwd = get_password_hash(password)
    user = User(id="user-1", email=email, hashed_password=hashed_pwd)
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login", data={"username": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_watchlist_operations(client, db_session, auth_headers):
    # Seed a film
    film = Film(id="film-1", title="Inception", release_year=2010, genre="Sci-Fi")
    db_session.add(film)
    db_session.commit()

    # 1. Get empty watchlist
    response = client.get("/api/v1/watchlist", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

    # 2. Add film to watchlist
    response = client.post(
        "/api/v1/watchlist", json={"film_id": "film-1"}, headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["film_id"] == "film-1"

    # 3. Add duplicate film to watchlist (should fail)
    response = client.post(
        "/api/v1/watchlist", json={"film_id": "film-1"}, headers=auth_headers
    )
    assert response.status_code == 400
    assert "already in watchlist" in response.json()["detail"]

    # 4. Get watchlist with 1 item
    response = client.get("/api/v1/watchlist", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["film"]["title"] == "Inception"

    # 5. Remove film from watchlist
    response = client.delete("/api/v1/watchlist/film-1", headers=auth_headers)
    assert response.status_code == 204

    # 6. Remove film not in watchlist (should fail)
    response = client.delete("/api/v1/watchlist/film-1", headers=auth_headers)
    assert response.status_code == 404
    assert "not in watchlist" in response.json()["detail"]


def test_add_nonexistent_film(client, auth_headers):
    response = client.post(
        "/api/v1/watchlist", json={"film_id": "nonexistent-id"}, headers=auth_headers
    )
    assert response.status_code == 404
    assert "Film not found" in response.json()["detail"]
