def test_create_recommendation_tokyo_success(client):
    payload = {
        "destination": "Tokyo, Japan",
        "budget": 150.0,
        "currency": "USD",
        "interests": ["Food & Dining", "Temples & Culture", "Anime & Pop Culture"],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert "request_id" in data
    assert "recommendation_id" in data
    assert data["destination"] == "Tokyo, Japan"
    assert data["budget"] == 150.0
    assert data["currency"] == "USD"
    assert "Food & Dining" in data["interests"]
    assert isinstance(data["items"], list)
    assert len(data["items"]) >= 2

    # Check item properties
    first_item = data["items"][0]
    assert "title" in first_item
    assert "category" in first_item
    assert "estimated_cost" in first_item
    assert "location" in first_item
    assert "duration" in first_item
    assert "description" in first_item


def test_create_recommendation_generic_destination(client):
    payload = {
        "destination": "Rome, Italy",
        "budget": 200.0,
        "currency": "EUR",
        "interests": ["Outdoor & Nature", "Culture & Heritage"],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["destination"] == "Rome, Italy"
    assert data["budget"] == 200.0
    assert data["currency"] == "EUR"
    assert len(data["items"]) >= 1


def test_get_recommendation_by_id_success(client):
    # First create
    create_payload = {
        "destination": "Paris, France",
        "budget": 120.0,
        "currency": "EUR",
        "interests": ["Food & Dining", "Culture & Heritage"],
    }
    create_resp = client.post("/api/v1/recommendations", json=create_payload)
    assert create_resp.status_code == 201
    rec_id = create_resp.json()["recommendation_id"]

    # Now get by ID
    get_resp = client.get(f"/api/v1/recommendations/{rec_id}")
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert data["recommendation_id"] == rec_id
    assert data["destination"] == "Paris, France"
    assert len(data["items"]) >= 1


def test_get_recommendation_not_found(client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.get(f"/api/v1/recommendations/{fake_id}")
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["detail"].lower()


def test_validation_empty_destination(client):
    payload = {
        "destination": "",
        "budget": 100.0,
        "currency": "USD",
        "interests": ["Food & Dining"],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 422


def test_validation_whitespace_destination(client):
    payload = {
        "destination": "   ",
        "budget": 100.0,
        "currency": "USD",
        "interests": ["Food & Dining"],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 422


def test_validation_zero_or_negative_budget(client):
    payload_zero = {
        "destination": "Tokyo",
        "budget": 0.0,
        "currency": "USD",
        "interests": ["Food & Dining"],
    }
    response_zero = client.post("/api/v1/recommendations", json=payload_zero)
    assert response_zero.status_code == 422

    payload_neg = {
        "destination": "Tokyo",
        "budget": -50.0,
        "currency": "USD",
        "interests": ["Food & Dining"],
    }
    response_neg = client.post("/api/v1/recommendations", json=payload_neg)
    assert response_neg.status_code == 422


def test_validation_empty_interests(client):
    payload = {
        "destination": "Tokyo",
        "budget": 100.0,
        "currency": "USD",
        "interests": [],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 422


def test_validation_blank_interests(client):
    payload = {
        "destination": "Tokyo",
        "budget": 100.0,
        "currency": "USD",
        "interests": ["  ", ""],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 422
