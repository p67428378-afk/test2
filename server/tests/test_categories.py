def test_get_categories(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    slugs = [c["slug"] for c in data]
    assert "beauty-wellness" in slugs
    assert "gourmet-food" in slugs
    for cat in data:
        assert "id" in cat
        assert "name" in cat
        assert "slug" in cat
