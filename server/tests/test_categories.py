def test_list_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    categories = response.json()
    assert isinstance(categories, list)
    assert len(categories) >= 4

    slugs = [c["slug"] for c in categories]
    assert "gourmet-food" in slugs
    assert "beauty-deluxe" in slugs
    assert "tech-gadgets" in slugs

    first = categories[0]
    assert "id" in first
    assert "name" in first
    assert "slug" in first
    assert "description" in first
