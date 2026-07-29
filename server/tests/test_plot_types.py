from fastapi.testclient import TestClient


def test_get_plot_types_unauthenticated(client: TestClient):
    response = client.get("/api/v1/plot-types")
    assert response.status_code == 401


def test_get_plot_types_authenticated(client: TestClient):
    # First login to get token
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "adminpassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get plot types
    response = client.get("/api/v1/plot-types", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

    # Verify seeded plot types are present
    names = [pt["name"] for pt in data]
    assert "Single Plot" in names
    assert "Companion Plot" in names
    assert "Family Plot (Estate)" in names
    assert "Cremation Niche" in names
    assert "Mausoleum Crypt" in names
    assert "Urn Garden" in names
