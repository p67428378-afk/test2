def test_create_recommendation_success(client):
    payload = {
        "destination": "Tokyo, Japan",
        "budget": 150.0,
        "currency": "USD",
        "interests": ["Food", "Temples"],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["request_id"] is not None
    assert len(data["items"]) > 0
    assert data["total_estimated_cost"] > 0
    assert data["request"]["destination"] == "Tokyo, Japan"
    assert data["request"]["budget"] == 150.0


def test_get_recommendation_by_id(client):
    create_payload = {
        "destination": "Paris, France",
        "budget": 200.0,
        "currency": "EUR",
        "interests": ["Culture", "Relaxation"],
    }
    create_res = client.post("/api/v1/recommendations", json=create_payload)
    assert create_res.status_code == 201
    rec_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/recommendations/{rec_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["id"] == rec_id
    assert len(data["items"]) > 0
    assert data["request"]["destination"] == "Paris, France"


def test_get_recommendation_not_found(client):
    response = client.get("/api/v1/recommendations/non-existent-uuid")
    assert response.status_code == 404
    assert "detail" in response.json()


def test_create_recommendation_validation_errors(client):
    # Empty destination
    res_empty_dest = client.post(
        "/api/v1/recommendations", json={"destination": "", "budget": 100.0}
    )
    assert res_empty_dest.status_code == 422

    # Negative budget
    res_neg_budget = client.post(
        "/api/v1/recommendations", json={"destination": "Rome", "budget": -50.0}
    )
    assert res_neg_budget.status_code == 422
