from fastapi import status


def test_get_driver_routes_and_update_stop(client):
    # Create order first
    order_resp = client.post(
        "/api/v1/orders",
        json={
            "service_type": "WASH_AND_FOLD",
            "pickup_window_start": "2026-08-15T09:00:00Z",
            "pickup_window_end": "2026-08-15T11:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "weight_kg": 5.0,
        },
    )
    assert order_resp.status_code == status.HTTP_201_CREATED

    # Fetch driver route for driver1
    routes_resp = client.get("/api/v1/routes/driver/driver1?zone=Zone1")
    assert routes_resp.status_code == status.HTTP_200_OK
    routes = routes_resp.json()
    assert len(routes) > 0

    stop_id = routes[0]["id"]

    # Update stop status to PICKED_UP
    update_resp = client.patch(
        f"/api/v1/routes/stops/{stop_id}",
        json={"stop_status": "PICKED_UP"},
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["stop_status"] == "PICKED_UP"


def test_customer_unavailable_rescheduling(client):
    routes_resp = client.get("/api/v1/routes/driver/driver2?zone=Zone2")
    assert routes_resp.status_code == status.HTTP_200_OK
    routes = routes_resp.json()
    assert len(routes) > 0

    stop_id = routes[0]["id"]

    # Update stop status to CUSTOMER_UNAVAILABLE
    update_resp = client.patch(
        f"/api/v1/routes/stops/{stop_id}",
        json={"stop_status": "CUSTOMER_UNAVAILABLE"},
    )
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["stop_status"] == "CUSTOMER_UNAVAILABLE"


def test_get_pickups(client):
    pickups_resp = client.get("/api/v1/pickups")
    assert pickups_resp.status_code == status.HTTP_200_OK
    assert isinstance(pickups_resp.json(), list)
