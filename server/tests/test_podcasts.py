"""Tests for podcast show catalog and detail endpoints."""


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


def test_root_endpoint(client):
    """Test root service metadata endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert data["message"] == "Podcast Discovery Hub API"


def test_list_podcasts_default(client):
    """Test listing all podcasts with default pagination."""
    response = client.get("/api/v1/podcasts")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "pages" in data
    assert data["page"] == 1
    assert data["limit"] == 10
    assert data["total"] >= 5
    assert len(data["items"]) >= 5

    # Check structure of podcast item
    first = data["items"][0]
    assert "id" in first
    assert "title" in first
    assert "description" in first
    assert "author" in first
    assert "cover_image_url" in first
    assert "category" in first
    assert "total_subscribers" in first
    assert "created_at" in first
    assert "updated_at" in first


def test_filter_podcasts_by_category(client):
    """Test filtering podcasts by category (e.g. Technology, Business)."""
    # Technology filter
    response_tech = client.get("/api/v1/podcasts?category=Technology")
    assert response_tech.status_code == 200
    data_tech = response_tech.json()
    assert data_tech["total"] >= 1
    for item in data_tech["items"]:
        assert item["category"].lower() == "technology"

    # Business filter
    response_biz = client.get("/api/v1/podcasts?category=Business")
    assert response_biz.status_code == 200
    data_biz = response_biz.json()
    assert data_biz["total"] >= 1
    for item in data_biz["items"]:
        assert item["category"].lower() == "business"

    # All category filter
    response_all = client.get("/api/v1/podcasts?category=All")
    assert response_all.status_code == 200
    data_all = response_all.json()
    assert data_all["total"] >= 5


def test_search_podcasts_by_keyword(client):
    """Test searching podcasts by keyword in title, author, or description."""
    # Search "tech"
    response = client.get("/api/v1/podcasts?search=tech")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    titles = [item["title"].lower() for item in data["items"]]
    assert any("tech" in t for t in titles)

    # Search author "Jane"
    response_author = client.get("/api/v1/podcasts?search=Jane")
    assert response_author.status_code == 200
    data_author = response_author.json()
    assert data_author["total"] >= 1
    authors = [item["author"] for item in data_author["items"]]
    assert any("Jane" in a for a in authors)


def test_search_podcasts_empty_result(client):
    """Test empty search results return 200 with empty items list and total 0."""
    response = client.get("/api/v1/podcasts?search=nonexistent_show_xyz_12345")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["pages"] == 0


def test_get_podcast_by_id_success(client):
    """Test retrieving an existing podcast by its UUID."""
    # First get list to find valid id
    list_res = client.get("/api/v1/podcasts")
    valid_id = list_res.json()["items"][0]["id"]

    response = client.get(f"/api/v1/podcasts/{valid_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == valid_id
    assert "title" in data
    assert "author" in data
    assert "cover_image_url" in data
    assert "category" in data
    assert "total_subscribers" in data


def test_get_podcast_by_id_not_found(client):
    """Test retrieving non-existent podcast returns 404."""
    response = client.get("/api/v1/podcasts/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Podcast show not found"


def test_podcasts_pagination(client):
    """Test pagination with page and limit parameters."""
    response = client.get("/api/v1/podcasts?page=1&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["limit"] == 2
    assert len(data["items"]) == 2
    assert data["pages"] >= 3

    # Page 2
    response_p2 = client.get("/api/v1/podcasts?page=2&limit=2")
    assert response_p2.status_code == 200
    data_p2 = response_p2.json()
    assert data_p2["page"] == 2
    assert len(data_p2["items"]) == 2
    # Check items on page 2 are different from page 1
    p1_ids = {item["id"] for item in data["items"]}
    p2_ids = {item["id"] for item in data_p2["items"]}
    assert p1_ids.isdisjoint(p2_ids)
