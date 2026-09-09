def test_generate_recommendations_with_preferences(client):
    user_id = "user_rec_test_001"
    # Set preferences for electronics and audio/anc tags
    pref_payload = {
        "user_id": user_id,
        "category_preferences": ["electronics"],
        "min_price": 50.0,
        "max_price": 250.0,
        "preferred_tags": ["audio", "anc", "wireless"],
    }
    client.post("/api/v1/preferences", json=pref_payload)

    # Generate recommendations
    gen_payload = {
        "user_id": user_id,
        "limit": 3,
    }
    res = client.post("/api/v1/recommendations/generate", json=gen_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == user_id
    assert "recommendations" in data
    assert len(data["recommendations"]) <= 3
    assert len(data["recommendations"]) > 0

    first_rec = data["recommendations"][0]
    assert "recommendation_id" in first_rec
    assert "product" in first_rec
    assert "match_score" in first_rec
    assert "recommendation_type" in first_rec
    assert first_rec["match_score"] > 0
    # Top recommended item should match electronics / audio tags
    assert first_rec["product"]["category"] == "electronics"


def test_generate_recommendations_fallback(client):
    # User with no preferences
    user_id = "user_no_prefs_999"
    gen_payload = {
        "user_id": user_id,
        "limit": 4,
    }
    res = client.post("/api/v1/recommendations/generate", json=gen_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == user_id
    assert len(data["recommendations"]) == 4
    for rec in data["recommendations"]:
        assert rec["recommendation_type"] in ["fallback_popular", "ai_vector"]
        assert rec["match_score"] > 0


def test_generate_recommendations_empty_user_id(client):
    res = client.post(
        "/api/v1/recommendations/generate", json={"user_id": "", "limit": 5}
    )
    assert res.status_code in [400, 422]
