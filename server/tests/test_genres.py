def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_genres_success(client):
    response = client.get("/api/v1/genres")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6

    genre_codes = [g["code"] for g in data]
    expected_codes = ["fantasy", "scifi", "cyberpunk", "mystery", "historical", "general"]
    for code in expected_codes:
        assert code in genre_codes

    # Verify genre fields
    for genre in data:
        assert "id" in genre
        assert "code" in genre
        assert "display_name" in genre
        assert "description" in genre
