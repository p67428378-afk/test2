from fastapi import status


def test_checkout_session(client):
    # Create order first
    order_resp = client.post(
        "/api/v1/orders",
        json={
            "service_type": "WASH_AND_FOLD",
            "pickup_window_start": "2026-08-15T09:00:00Z",
            "pickup_window_end": "2026-08-15T11:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "weight_kg": 7.0,
        },
    )
    order_id = order_resp.json()["id"]

    # Create checkout session
    session_resp = client.post(
        "/api/v1/payments/checkout-session",
        json={"order_id": order_id, "amount": 45.0, "currency": "USD"},
    )
    assert session_resp.status_code == status.HTTP_200_OK
    data = session_resp.json()
    assert "checkout_url" in data
    assert data["order_id"] == order_id
    assert data["status"] == "PENDING"


def test_stripe_webhook(client):
    order_resp = client.post(
        "/api/v1/orders",
        json={
            "service_type": "DRY_CLEANING",
            "pickup_window_start": "2026-08-15T09:00:00Z",
            "pickup_window_end": "2026-08-15T11:00:00Z",
            "delivery_window_start": "2026-08-16T14:00:00Z",
            "delivery_window_end": "2026-08-16T16:00:00Z",
            "item_count": 4,
        },
    )
    order_id = order_resp.json()["id"]

    # Post webhook
    webhook_payload = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_123",
                "metadata": {"order_id": order_id},
            }
        },
    }
    webhook_resp = client.post(
        "/api/v1/payments/stripe/webhook",
        json=webhook_payload,
        headers={"Stripe-Signature": "t=123,v1=mock_signature"},
    )
    assert webhook_resp.status_code == status.HTTP_200_OK
    assert webhook_resp.json()["status"] == "success"

    # Verify order payment_status is now PAID
    get_order_resp = client.get(f"/api/v1/orders/{order_id}")
    assert get_order_resp.status_code == status.HTTP_200_OK
    assert get_order_resp.json()["payment_status"] == "PAID"
