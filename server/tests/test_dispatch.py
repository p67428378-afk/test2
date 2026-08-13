from datetime import datetime, timezone, timedelta


def get_token(client, email, password):
    resp = client.post(
        "/api/v1/auth/login/json", json={"email": email, "password": password}
    )
    return resp.json()["access_token"]


def test_dispatch_assignment_success(client):
    cust_token = get_token(client, "test@example.com", "testpassword")
    op_token = get_token(client, "operator@example.com", "operatorpassword")

    # 1. Create a 5000L booking
    booking_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {cust_token}"},
        json={
            "delivery_address": "456 Main St",
            "volume_liters": 5000,
            "scheduled_time": (
                datetime.now(timezone.utc) + timedelta(hours=2)
            ).isoformat(),
        },
    )
    booking_id = booking_res.json()["id"]

    # 2. Get driver ID and available tanker ID (TK-1001, 5000L)
    users_res = client.get(
        "/api/v1/users?role=DRIVER", headers={"Authorization": f"Bearer {op_token}"}
    )
    driver_id = users_res.json()[0]["id"]

    tankers_res = client.get(
        "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
    )
    tanker_5000 = next(
        t for t in tankers_res.json() if t["registration_number"] == "TK-1001"
    )

    # 3. Assign
    assign_res = client.post(
        "/api/v1/dispatch/assign",
        headers={"Authorization": f"Bearer {op_token}"},
        json={
            "booking_id": booking_id,
            "driver_id": driver_id,
            "tanker_id": tanker_5000["id"],
        },
    )
    assert assign_res.status_code == 200
    data = assign_res.json()
    assert data["status"] == "ASSIGNED"
    assert data["driver_id"] == driver_id
    assert data["tanker_id"] == tanker_5000["id"]


def test_dispatch_maintenance_tanker_blocked(client):
    cust_token = get_token(client, "test@example.com", "testpassword")
    op_token = get_token(client, "operator@example.com", "operatorpassword")

    booking_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {cust_token}"},
        json={
            "delivery_address": "789 Pine St",
            "volume_liters": 1000,
            "scheduled_time": (
                datetime.now(timezone.utc) + timedelta(hours=3)
            ).isoformat(),
        },
    )
    booking_id = booking_res.json()["id"]

    users_res = client.get(
        "/api/v1/users?role=DRIVER", headers={"Authorization": f"Bearer {op_token}"}
    )
    driver_id = users_res.json()[0]["id"]

    tankers_res = client.get(
        "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
    )
    maint_tanker = next(
        t for t in tankers_res.json() if t["registration_number"] == "TK-1003"
    )

    assign_res = client.post(
        "/api/v1/dispatch/assign",
        headers={"Authorization": f"Bearer {op_token}"},
        json={
            "booking_id": booking_id,
            "driver_id": driver_id,
            "tanker_id": maint_tanker["id"],
        },
    )
    assert assign_res.status_code == 400
    assert "maintenance" in assign_res.json()["detail"].lower()


def test_dispatch_insufficient_capacity_blocked(client):
    cust_token = get_token(client, "test@example.com", "testpassword")
    op_token = get_token(client, "operator@example.com", "operatorpassword")

    # 10000L booking
    booking_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {cust_token}"},
        json={
            "delivery_address": "Large Commercial Plaza",
            "volume_liters": 10000,
            "scheduled_time": (
                datetime.now(timezone.utc) + timedelta(hours=4)
            ).isoformat(),
        },
    )
    booking_id = booking_res.json()["id"]

    driver_id = client.get(
        "/api/v1/users?role=DRIVER", headers={"Authorization": f"Bearer {op_token}"}
    ).json()[0]["id"]
    tankers_res = client.get(
        "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
    )
    small_tanker = next(
        t for t in tankers_res.json() if t["registration_number"] == "TK-1001"
    )  # 5000L

    assign_res = client.post(
        "/api/v1/dispatch/assign",
        headers={"Authorization": f"Bearer {op_token}"},
        json={
            "booking_id": booking_id,
            "driver_id": driver_id,
            "tanker_id": small_tanker["id"],
        },
    )
    assert assign_res.status_code == 400
    assert "capacity" in assign_res.json()["detail"].lower()


def test_dispatch_forbidden_for_customer(client):
    cust_token = get_token(client, "test@example.com", "testpassword")

    response = client.post(
        "/api/v1/dispatch/assign",
        headers={"Authorization": f"Bearer {cust_token}"},
        json={"booking_id": "dummy", "driver_id": "dummy", "tanker_id": "dummy"},
    )
    assert response.status_code == 403
