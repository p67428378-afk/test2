from fastapi import status


def test_create_order(client):
    response = client.post(
        "/api/v1/orders",
        json={
            "service_type": "WASH_AND_FOLD",
            "pickup_window_start": "2026-08-15T09:00:00Z",
            "pickup_window_end": "2026-08-15T11:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "item_count": 10,
            "weight_kg": 5.0,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["status"] == "SCHEDULED_FOR_PICKUP"
    assert data["service_type"] == "WASH_AND_FOLD"
    assert data["total_amount"] > 0
    assert len(data["stages"]) >= 1


def test_create_order_outside_hours(client):
    response = client.post(
        "/api/v1/orders",
        json={
            "service_type": "WASH_AND_FOLD",
            "pickup_window_start": "2026-08-15T05:00:00Z",
            "pickup_window_end": "2026-08-15T07:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "operating hours" in response.json()["detail"]


def test_get_order(client):
    create_resp = client.post(
        "/api/v1/orders",
        json={
            "service_type": "DRY_CLEANING",
            "pickup_window_start": "2026-08-15T10:00:00Z",
            "pickup_window_end": "2026-08-15T12:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "item_count": 3,
        },
    )
    order_id = create_resp.json()["id"]

    get_resp = client.get(f"/api/v1/orders/{order_id}")
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["id"] == order_id


def test_update_order_stage(client):
    create_resp = client.post(
        "/api/v1/orders",
        json={
            "service_type": "IRONING_ONLY",
            "pickup_window_start": "2026-08-15T11:00:00Z",
            "pickup_window_end": "2026-08-15T13:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "item_count": 5,
        },
    )
    order_id = create_resp.json()["id"]

    # Advance stage to WASHING
    patch_resp = client.patch(
        f"/api/v1/orders/{order_id}/stage",
        json={"stage": "WASHING", "notes": "In washing machine #2"},
    )
    assert patch_resp.status_code == status.HTTP_200_OK
    assert patch_resp.json()["status"] == "IN_PROCESS"

    # Advance stage to READY_FOR_DELIVERY
    patch_ready = client.patch(
        f"/api/v1/orders/{order_id}/stage",
        json={"stage": "READY_FOR_DELIVERY", "notes": "Ironed and bagged"},
    )
    assert patch_ready.status_code == status.HTTP_200_OK
    assert patch_ready.json()["status"] == "READY_FOR_DELIVERY"


def test_special_processing_stage(client):
    create_resp = client.post(
        "/api/v1/orders",
        json={
            "service_type": "DRY_CLEANING",
            "pickup_window_start": "2026-08-15T12:00:00Z",
            "pickup_window_end": "2026-08-15T14:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "item_count": 2,
        },
    )
    order_id = create_resp.json()["id"]

    patch_resp = client.patch(
        f"/api/v1/orders/{order_id}/stage",
        json={"stage": "SPECIAL_PROCESSING", "notes": "Delicate silk item flagged"},
    )
    assert patch_resp.status_code == status.HTTP_200_OK
    assert patch_resp.json()["status"] == "SPECIAL_PROCESSING"
