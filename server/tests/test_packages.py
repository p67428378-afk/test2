def test_get_packages(client):
    response = client.get("/api/v1/packages")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) == 3
    assert data["total"] == 3

    # Test filtering by destination
    response = client.get("/api/v1/packages?destination=Hawaii")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["destination"] == "Hawaii"


def test_get_package_detail(client):
    # First get all packages to find a valid ID
    response = client.get("/api/v1/packages")
    packages = response.json()["items"]
    package_id = packages[0]["id"]

    # Get package detail
    response = client.get(f"/api/v1/packages/{package_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == package_id
    assert "itinerary" in data
    assert "reviews" in data
    assert len(data["itinerary"]) > 0
    assert len(data["reviews"]) > 0


def test_get_package_not_found(client):
    response = client.get("/api/v1/packages/nonexistent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Package not found"
