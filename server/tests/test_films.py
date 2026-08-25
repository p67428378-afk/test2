from server.app.models.film import Film


def test_search_films_validation(client):
    # Search query less than 2 characters should return 400
    response = client.get("/api/v1/films?search=a")
    assert response.status_code == 400
    assert "must be at least 2 characters" in response.json()["detail"]


def test_search_films_no_match(client, db_session):
    # Seed a film
    film = Film(id="1", title="Inception", release_year=2010, genre="Sci-Fi")
    db_session.add(film)
    db_session.commit()

    # Search for non-existent film
    response = client.get("/api/v1/films?search=Avatar")
    assert response.status_code == 200
    assert response.json() == []


def test_search_films_success(client, db_session):
    # Seed films
    film1 = Film(id="1", title="Inception", release_year=2010, genre="Sci-Fi")
    film2 = Film(id="2", title="Interstellar", release_year=2014, genre="Sci-Fi")
    db_session.add(film1)
    db_session.add(film2)
    db_session.commit()

    # Search for "Incept"
    response = client.get("/api/v1/films?search=Incept")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Inception"
    assert data[0]["release_year"] == 2010
