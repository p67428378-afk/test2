from datetime import datetime, timezone, timedelta


def get_customer_token(client):
    resp = client.post(
        "/api/v1/auth/login/json",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    return resp.json()["access_token"]


def get_operator_token(client):
    resp = client.post(
        "/api/v1/auth/login/json",
        json={"email": "operator@example.com", "password": "operatorpassword"},
    )
    return resp.json()["access_token"]


def test_create_booking_success(client):
    token = get_customer_token(client)
    scheduled = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()

    response = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "delivery_address": "123 Park Avenue",
            "volume_liters": 5000,
            "scheduled_time": scheduled,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "PENDING_ASSIGNMENT"
    assert data["volume_liters"] == 5000
    assert data["delivery_address"] == "123 Park Avenue"
    assert "id" in data


def test_create_booking_unsupported_volume(client):
    token = get_customer_token(client)
    scheduled = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()

    response = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "delivery_address": "123 Park Avenue",
            "volume_liters": 3000,  # Unsupported
            "scheduled_time": scheduled,
        },
    )
    assert response.status_code == 422


def test_create_booking_unauthenticated(client):
    scheduled = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    response = client.post(
        "/api/v1/bookings",
        json={
            "delivery_address": "123 Park Avenue",
            "volume_liters": 5000,
            "scheduled_time": scheduled,
        },
    )
    assert response.status_code == 401


def test_list_bookings_role_filtering(client):
    cust_token = get_customer_token(client)
    op_token = get_operator_token(client)

    # Customer lists bookings
    res_cust = client.get(
        "/api/v1/bookings", headers={"Authorization": f"Bearer {cust_token}"}
    )
    assert res_cust.status_code == 200

    # Operator lists bookings
    res_op = client.get(
        "/api/v1/bookings", headers={"Authorization": f"Bearer {op_token}"}
    )
    assert res_op.status_code == 200
