from fastapi import status


def test_get_driver_routes(client):
    response = client.get("/api/v1/routes/driver/driver-123?zone=Zone%201")
    assert response.status_code == status.HTTP_200_OK
    routes = response.json()
    assert isinstance(routes, list)
    assert len(routes) > 0


def test_update_stop_status(client):
    # Retrieve driver route
    routes_resp = client.get("/api/v1/routes/driver/driver-123")
    stop_id = routes_resp.json()[0]["id"]

    # Update stop status to PICKED_UP
    patch_resp = client.patch(
        f"/api/v1/routes/stops/{stop_id}",
        json={"stop_status": "PICKED_UP"},
    )
    assert patch_resp.status_code == status.HTTP_200_OK
    assert patch_resp.json()["stop_status"] == "PICKED_UP"


def test_customer_unavailable_retry(client):
    routes_resp = client.get("/api/v1/routes/driver/driver-123")
    stop_id = routes_resp.json()[0]["id"]

    patch_resp = client.patch(
        f"/api/v1/routes/stops/{stop_id}",
        json={"stop_status": "CUSTOMER_UNAVAILABLE"},
    )
    assert patch_resp.status_code == status.HTTP_200_OK
    assert patch_resp.json()["stop_status"] == "CUSTOMER_UNAVAILABLE"
