from unittest.mock import patch


def test_get_daily_quote(client):
    response = client.get("/api/v1/quotes/daily")
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "author" in data
    assert "id" in data


def test_get_random_quote(client):
    response = client.get("/api/v1/quotes/random")
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "author" in data
    assert "id" in data


@patch("server.routers.quotes.httpx.get")
def test_get_daily_quote_external_api_success(mock_get, client):
    # Mock external API response
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = [
        {"q": "This is an external quote.", "a": "External Author", "h": "..."}
    ]

    # Clear cache to force fetch
    from server.routers.quotes import _qotd_cache

    _qotd_cache.clear()

    response = client.get("/api/v1/quotes/daily")
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == "This is an external quote."
    assert data["author"] == "External Author"


@patch("server.routers.quotes.httpx.get")
def test_get_daily_quote_external_api_failure_fallback(mock_get, client):
    # Mock external API failure
    mock_get.side_effect = Exception("API Down")

    # Clear cache to force fetch
    from server.routers.quotes import _qotd_cache

    _qotd_cache.clear()

    response = client.get("/api/v1/quotes/daily")
    assert response.status_code == 200
    data = response.json()
    # Should fallback to a seeded quote from the database
    assert "text" in data
    assert "author" in data
