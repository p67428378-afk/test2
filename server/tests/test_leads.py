from fastapi.testclient import TestClient


def test_submit_lead_success(client: TestClient):
    payload = {
        "client_name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "budget_range": "$5,000 - $10,000",
        "message": "We need a full-stack developer to revamp our customer portal.",
    }
    response = client.post("/api/v1/leads", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["client_name"] == "Alice Johnson"
    assert data["email"] == "alice.johnson@example.com"
    assert data["budget_range"] == "$5,000 - $10,000"
    assert (
        data["message"]
        == "We need a full-stack developer to revamp our customer portal."
    )
    assert data["status"] == "new"
    assert "created_at" in data


def test_submit_lead_invalid_email(client: TestClient):
    payload = {
        "client_name": "Bob Smith",
        "email": "not-an-email",
        "budget_range": "$1,000 - $5,000",
        "message": "Hello world",
    }
    response = client.post("/api/v1/leads", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


def test_submit_lead_missing_required_fields(client: TestClient):
    payload = {"client_name": "Bob Smith"}
    response = client.post("/api/v1/leads", json=payload)
    assert response.status_code == 422


def test_list_leads_success(client: TestClient):
    # First submit a lead
    payload = {
        "client_name": "Charlie Davis",
        "email": "charlie@example.com",
        "budget_range": "$10,000+",
        "message": "Looking for ongoing full-stack support.",
    }
    post_res = client.post("/api/v1/leads", json=payload)
    assert post_res.status_code == 201

    # List leads
    get_res = client.get("/api/v1/leads")
    assert get_res.status_code == 200
    leads = get_res.json()
    assert isinstance(leads, list)
    assert len(leads) >= 1
    assert any(lead["email"] == "charlie@example.com" for lead in leads)


def test_health_endpoints(client: TestClient):
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "message" in res_root.json()

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json() == {"status": "healthy"}
