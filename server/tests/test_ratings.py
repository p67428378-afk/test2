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


def test_ratings_operations(client, db_session, auth_headers):
    # Seed a film
    film = Film(id="film-1", title="Inception", release_year=2010, genre="Sci-Fi")
    db_session.add(film)
    db_session.commit()

    # 1. Get empty ratings
    response = client.get("/api/v1/ratings", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

    # 2. Rate film (1-5 stars)
    response = client.post(
        "/api/v1/ratings", json={"film_id": "film-1", "rating": 4}, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == 4

    # 3. Update rating
    response = client.post(
        "/api/v1/ratings", json={"film_id": "film-1", "rating": 5}, headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == 5

    # 4. Get ratings with 1 item
    response = client.get("/api/v1/ratings", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["rating"] == 5
    assert data[0]["film"]["title"] == "Inception"

    # 5. Clear rating
    response = client.delete("/api/v1/ratings/film-1", headers=auth_headers)
    assert response.status_code == 204

    # 6. Clear non-existent rating (should fail)
    response = client.delete("/api/v1/ratings/film-1", headers=auth_headers)
    assert response.status_code == 404
    assert "Rating not found" in response.json()["detail"]


def test_invalid_rating_values(client, db_session, auth_headers):
    # Seed a film
    film = Film(id="film-1", title="Inception", release_year=2010, genre="Sci-Fi")
    db_session.add(film)
    db_session.commit()

    # Rating too low (0)
    response = client.post(
        "/api/v1/ratings", json={"film_id": "film-1", "rating": 0}, headers=auth_headers
    )
    assert response.status_code == 422

    # Rating too high (6)
    response = client.post(
        "/api/v1/ratings", json={"film_id": "film-1", "rating": 6}, headers=auth_headers
    )
    assert response.status_code == 422
