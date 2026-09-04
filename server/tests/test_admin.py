def test_get_admin_insights_authorized(client, admin_headers):
    response = client.get("/api/v1/admin/insights", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_feedback" in data
    assert "avg_rating" in data
    assert "sentiment_distribution" in data
    assert "top_topics" in data
    assert data["total_feedback"] >= 1
    assert data["sentiment_distribution"]["positive"] >= 0


def test_get_admin_insights_with_days_filter(client, admin_headers):
    response = client.get("/api/v1/admin/insights?days=30", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_feedback" in data


def test_get_admin_insights_forbidden_for_regular_user(client, user_headers):
    response = client.get("/api/v1/admin/insights", headers=user_headers)
    assert response.status_code == 403
    assert "Admin privileges required" in response.json()["detail"]


def test_get_admin_insights_unauthorized(client):
    response = client.get("/api/v1/admin/insights")
    assert response.status_code == 401


def test_get_admin_feedback_list_authorized(client, admin_headers):
    response = client.get(
        "/api/v1/admin/feedback?skip=0&limit=10", headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["skip"] == 0
    assert data["limit"] == 10
    assert len(data["items"]) > 0


def test_get_admin_feedback_list_filtered_by_sentiment(client, admin_headers):
    response = client.get(
        "/api/v1/admin/feedback?sentiment=Positive", headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        if item.get("sentiment_analysis"):
            assert item["sentiment_analysis"]["sentiment"] == "Positive"


def test_get_admin_feedback_list_search(client, admin_headers):
    response = client.get(
        "/api/v1/admin/feedback?search=dashboard", headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data


def test_get_admin_feedback_list_forbidden(client, user_headers):
    response = client.get("/api/v1/admin/feedback", headers=user_headers)
    assert response.status_code == 403


def test_reanalyze_feedback_endpoint(client, admin_headers):
    # First create feedback
    create_res = client.post(
        "/api/v1/feedback",
        json={"feedback_text": "Great service and fast response!", "rating": 5},
    )
    feedback_id = create_res.json()["id"]

    # Reanalyze as admin
    re_res = client.post(
        f"/api/v1/admin/feedback/{feedback_id}/reanalyze",
        headers=admin_headers,
    )
    assert re_res.status_code == 200
    data = re_res.json()
    assert data["id"] == feedback_id
    assert data["analysis_status"] == "Analyzed"


def test_reanalyze_feedback_nonexistent(client, admin_headers):
    response = client.post(
        "/api/v1/admin/feedback/non-existent-uuid/reanalyze",
        headers=admin_headers,
    )
    assert response.status_code == 404
