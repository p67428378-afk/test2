def test_generate_names_default(client):
    response = client.post("/api/v1/names/generate", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["genre"] == "general"
    assert data["quantity"] == 5
    assert len(data["names"]) == 5
    assert "generated_at" in data
    # Check uniqueness
    assert len(set(data["names"])) == 5


def test_generate_names_all_genres(client):
    genres = [
        "fantasy",
        "scifi",
        "cyberpunk",
        "mystery",
        "historical",
        "general",
    ]
    for g in genres:
        response = client.post(
            "/api/v1/names/generate",
            json={"genre": g, "quantity": 3},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["genre"] == g
        assert data["quantity"] == 3
        assert len(data["names"]) == 3
        assert len(set(data["names"])) == 3


def test_generate_names_case_insensitive_and_display_name(client):
    response = client.post(
        "/api/v1/names/generate",
        json={"genre": "Cyberpunk", "quantity": 4},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["genre"] == "cyberpunk"
    assert len(data["names"]) == 4

    response_scifi = client.post(
        "/api/v1/names/generate",
        json={"genre": "Sci-Fi", "quantity": 2},
    )
    assert response_scifi.status_code == 200
    assert response_scifi.json()["genre"] == "scifi"


def test_generate_names_quantity_boundaries(client):
    # Minimum valid quantity
    res_min = client.post(
        "/api/v1/names/generate",
        json={"genre": "fantasy", "quantity": 1},
    )
    assert res_min.status_code == 200
    assert len(res_min.json()["names"]) == 1

    # Maximum valid quantity
    res_max = client.post(
        "/api/v1/names/generate",
        json={"genre": "fantasy", "quantity": 10},
    )
    assert res_max.status_code == 200
    assert len(res_max.json()["names"]) == 10
    assert len(set(res_max.json()["names"])) == 10


def test_generate_names_sub_tags(client):
    response = client.post(
        "/api/v1/names/generate",
        json={"genre": "fantasy", "quantity": 3, "sub_tags": ["female"]},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["names"]) == 3


def test_generate_names_invalid_genre(client):
    response = client.post(
        "/api/v1/names/generate",
        json={"genre": "unsupported_alien_genre", "quantity": 5},
    )
    assert response.status_code == 400
    data = response.json()
    assert "Invalid genre selected" in data["detail"]
    assert "Fantasy, Sci-Fi, Cyberpunk, Mystery, Historical, General" in data["detail"]


def test_generate_names_invalid_quantity_low(client):
    response = client.post(
        "/api/v1/names/generate",
        json={"genre": "fantasy", "quantity": 0},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Quantity must be between 1 and 10."


def test_generate_names_invalid_quantity_high(client):
    response = client.post(
        "/api/v1/names/generate",
        json={"genre": "fantasy", "quantity": 11},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Quantity must be between 1 and 10."


def test_generate_names_invalid_quantity_type(client):
    response = client.post(
        "/api/v1/names/generate",
        json={"genre": "fantasy", "quantity": "invalid_number"},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Quantity must be between 1 and 10."
