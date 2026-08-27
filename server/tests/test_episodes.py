"""Tests for episode feed and single episode retrieval endpoints."""


def test_get_podcast_episodes_success(client):
    """Test retrieving paginated episodes for a specific podcast."""
    # Find Tech Pulse Daily show
    podcasts_res = client.get("/api/v1/podcasts?search=Tech%20Pulse")
    assert podcasts_res.status_code == 200
    podcast_id = podcasts_res.json()["items"][0]["id"]

    response = client.get(f"/api/v1/podcasts/{podcast_id}/episodes")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "pages" in data
    assert data["total"] >= 3
    assert len(data["items"]) >= 3

    # Check episode sorting: publish_date descending
    episodes = data["items"]
    for i in range(len(episodes) - 1):
        assert episodes[i]["publish_date"] >= episodes[i + 1]["publish_date"]

    # Check episode item fields
    first_ep = episodes[0]
    assert "id" in first_ep
    assert first_ep["podcast_id"] == podcast_id
    assert "title" in first_ep
    assert "description" in first_ep
    assert "audio_url" in first_ep
    assert "duration_seconds" in first_ep
    assert "episode_number" in first_ep
    assert "publish_date" in first_ep


def test_get_podcast_episodes_not_found(client):
    """Test retrieving episodes for a non-existent podcast returns 404."""
    response = client.get(
        "/api/v1/podcasts/00000000-0000-0000-0000-000000000000/episodes"
    )
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Podcast show not found"


def test_get_podcast_episodes_pagination(client):
    """Test episode list pagination."""
    podcasts_res = client.get("/api/v1/podcasts?search=Tech%20Pulse")
    podcast_id = podcasts_res.json()["items"][0]["id"]

    response_p1 = client.get(f"/api/v1/podcasts/{podcast_id}/episodes?page=1&limit=1")
    assert response_p1.status_code == 200
    data_p1 = response_p1.json()
    assert data_p1["page"] == 1
    assert data_p1["limit"] == 1
    assert len(data_p1["items"]) == 1

    response_p2 = client.get(f"/api/v1/podcasts/{podcast_id}/episodes?page=2&limit=1")
    assert response_p2.status_code == 200
    data_p2 = response_p2.json()
    assert data_p2["page"] == 2
    assert len(data_p2["items"]) == 1
    assert data_p1["items"][0]["id"] != data_p2["items"][0]["id"]


def test_get_single_episode_success(client):
    """Test retrieving single episode by its ID."""
    podcasts_res = client.get("/api/v1/podcasts?search=Tech%20Pulse")
    podcast_id = podcasts_res.json()["items"][0]["id"]

    episodes_res = client.get(f"/api/v1/podcasts/{podcast_id}/episodes")
    episode_id = episodes_res.json()["items"][0]["id"]

    response = client.get(f"/api/v1/episodes/{episode_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == episode_id
    assert data["podcast_id"] == podcast_id
    assert "title" in data
    assert "description" in data
    assert "audio_url" in data
    assert "duration_seconds" in data
    assert "episode_number" in data
    assert "publish_date" in data


def test_get_single_episode_not_found(client):
    """Test retrieving non-existent episode returns 404."""
    response = client.get("/api/v1/episodes/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Episode not found"
