from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test standard health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_api_v1_health_check(client: TestClient):
    """Test v1 health check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_cors_preflight(client: TestClient):
    """Test CORS preflight response headers."""
    response = client.options(
        "/api/v1/calculate-tip",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert response.status_code == 200
    assert (
        response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    )
