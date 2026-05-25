from fastapi.testclient import TestClient

def test_create_portfolio(client: TestClient):
    response = client.post(
        "/api/v1/portfolios/",
        json={"client_id": 1, "holdings": [{"asset_type": "stock", "quantity": 100, "purchase_price": 10, "purchase_date": "2023-01-01"}]},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["client_id"] == 1
    assert len(data["holdings"]) == 1
    assert data["holdings"][0]["asset_type"] == "stock"

def test_get_portfolio(client: TestClient):
    # First create a portfolio to have something to fetch
    create_response = client.post(
        "/api/v1/portfolios/",
        json={"client_id": 2, "holdings": []},
    )
    portfolio_id = create_response.json()["id"]

    response = client.get(f"/api/v1/portfolios/{portfolio_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["client_id"] == 2

def test_run_risk_assessment(client: TestClient):
    # First create a portfolio
    response = client.post(
        "/api/v1/portfolios/",
        json={"client_id": 3, "holdings": [{"asset_type": "stock", "quantity": 100, "purchase_price": 10, "purchase_date": "2023-01-01"}]},
    )
    portfolio_id = response.json()["id"]

    response = client.post(f"/api/v1/portfolios/{portfolio_id}/assess-risk")
    assert response.status_code == 200
    data = response.json()
    assert data["portfolio_id"] == portfolio_id
    assert "var" in data
    assert "stress_test_results" in data
    assert "sebi_violations" in data
    assert "risk_score" in data
    assert "recommendations" in data
