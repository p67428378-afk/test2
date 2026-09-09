"""Tests for AI Recommendation Generation, Filtering, and History API endpoints."""


def test_generate_recommendations_with_preferences(client):
    """Verify AI recommendation generation matches user preferences."""
    user_id = "test_rec_user_001"
    # Create preference
    client.post(
        "/api/v1/preferences",
        json={
            "user_id": user_id,
            "category_preferences": ["electronics"],
            "min_price": 100.0,
            "max_price": 300.0,
            "preferred_tags": ["wireless", "audio", "anc"],
        },
    )

    # Generate recommendations
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={
            "user_id": user_id,
            "limit": 3,
            "sort_by": "match_score",
            "sort_order": "desc",
        },
    )
    assert gen_res.status_code == 200
    data = gen_res.json()
    assert data["user_id"] == user_id
    assert "session_id" in data
    assert len(data["recommendations"]) <= 3
    assert len(data["recommendations"]) > 0

    top_item = data["recommendations"][0]
    assert "recommendation_id" in top_item
    assert "match_score" in top_item
    assert top_item["product"]["category"] == "electronics"
    assert top_item["match_score"] > 0


def test_generate_recommendations_min_rating_filter(client):
    """Verify min_rating filter only returns products meeting the threshold."""
    user_id = "test_rec_user_rating"
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={
            "user_id": user_id,
            "limit": 5,
            "min_rating": 4.5,
            "sort_by": "rating",
            "sort_order": "desc",
        },
    )
    assert gen_res.status_code == 200
    data = gen_res.json()
    for rec in data["recommendations"]:
        assert rec["product"]["rating"] >= 4.5


def test_generate_recommendations_sorting_by_price(client):
    """Verify sorting recommendations by price ascending."""
    user_id = "test_rec_user_price_sort"
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={
            "user_id": user_id,
            "limit": 5,
            "sort_by": "price",
            "sort_order": "asc",
        },
    )
    assert gen_res.status_code == 200
    recs = gen_res.json()["recommendations"]
    prices = [r["product"]["price"] for r in recs]
    assert prices == sorted(prices)


def test_recommendation_history(client):
    """Verify recommendation sessions are logged and retrievable via history endpoint."""
    user_id = "test_rec_user_history"
    # Generate two recommendation sessions
    client.post(
        "/api/v1/recommendations/generate",
        json={"user_id": user_id, "limit": 2},
    )
    client.post(
        "/api/v1/recommendations/generate",
        json={"user_id": user_id, "limit": 2},
    )

    # Fetch history
    history_res = client.get(
        f"/api/v1/recommendations/history?user_id={user_id}&skip=0&limit=10"
    )
    assert history_res.status_code == 200
    data = history_res.json()
    assert "sessions" in data
    assert "total" in data
    assert data["total"] >= 2
    assert len(data["sessions"]) >= 2
    first_session = data["sessions"][0]
    assert "session_id" in first_session
    assert "timestamp" in first_session
    assert first_session["total_recommendations"] > 0
    assert len(first_session["items"]) > 0
