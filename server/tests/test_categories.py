def test_list_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    categories = response.json()
    assert isinstance(categories, list)
    names = [c["name"] for c in categories]
    assert "HVAC" in names
    assert "Plumbing" in names
    assert "Electrical" in names


def test_create_category(client):
    response = client.post(
        "/api/v1/categories",
        json={"name": "Roofing", "description": "Roof maintenance and repairs"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Roofing"
    assert "id" in data
