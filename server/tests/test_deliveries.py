from datetime import datetime, timezone, timedelta


def get_token(client, email, password):
    resp = client.post(
        "/api/v1/auth/login/json", json={"email": email, "password": password}
    )
    return resp.json()["access_token"]


def test_delivery_lifecycle_and_tanker_release(client):
    cust_token = get_token(client, "test@example.com", "testpassword")
    op_token = get_token(client, "operator@example.com", "operatorpassword")
    drv_token = get_token(client, "driver@example.com", "driverpassword")

    # 1. Create booking
    b_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {cust_token}"},
        json={
            "delivery_address": "100 River Road",
            "volume_liters": 5000,
            "scheduled_time": (
                datetime.now(timezone.utc) + timedelta(hours=1)
            ).isoformat(),
        },
    )
    booking_id = b_res.json()["id"]

    # 2. Dispatch assign
    driver_id = client.get(
        "/api/v1/users?role=DRIVER", headers={"Authorization": f"Bearer {op_token}"}
    ).json()[0]["id"]
    tankers = client.get(
        "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
    ).json()
    tanker_id = next(t["id"] for t in tankers if t["registration_number"] == "TK-1002")

    client.post(
        "/api/v1/dispatch/assign",
        headers={"Authorization": f"Bearer {op_token}"},
        json={"booking_id": booking_id, "driver_id": driver_id, "tanker_id": tanker_id},
    )

    # Tanker should now be IN_USE
    t_check1 = next(
        t
        for t in client.get(
            "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
        ).json()
        if t["id"] == tanker_id
    )
    assert t_check1["status"] == "IN_USE"

    # 3. Lifecycle transitions
    # EN_ROUTE
    res1 = client.patch(
        f"/api/v1/deliveries/{booking_id}/status",
        headers={"Authorization": f"Bearer {drv_token}"},
        json={"status": "EN_ROUTE"},
    )
    assert res1.status_code == 200
    assert res1.json()["status"] == "EN_ROUTE"

    # ARRIVED
    res2 = client.patch(
        f"/api/v1/deliveries/{booking_id}/status",
        headers={"Authorization": f"Bearer {drv_token}"},
        json={"status": "ARRIVED"},
    )
    assert res2.status_code == 200
    assert res2.json()["status"] == "ARRIVED"

    # DISCHARGING
    res3 = client.patch(
        f"/api/v1/deliveries/{booking_id}/status",
        headers={"Authorization": f"Bearer {drv_token}"},
        json={"status": "DISCHARGING"},
    )
    assert res3.status_code == 200
    assert res3.json()["status"] == "DISCHARGING"

    # COMPLETED
    res4 = client.patch(
        f"/api/v1/deliveries/{booking_id}/status",
        headers={"Authorization": f"Bearer {drv_token}"},
        json={"status": "COMPLETED"},
    )
    assert res4.status_code == 200
    assert res4.json()["status"] == "COMPLETED"

    # Tanker should now be AVAILABLE again
    t_check2 = next(
        t
        for t in client.get(
            "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
        ).json()
        if t["id"] == tanker_id
    )
    assert t_check2["status"] == "AVAILABLE"


def test_invalid_status_transition(client):
    cust_token = get_token(client, "test@example.com", "testpassword")
    op_token = get_token(client, "operator@example.com", "operatorpassword")
    drv_token = get_token(client, "driver@example.com", "driverpassword")

    b_res = client.post(
        "/api/v1/bookings",
        headers={"Authorization": f"Bearer {cust_token}"},
        json={
            "delivery_address": "200 Lake Drive",
            "volume_liters": 1000,
            "scheduled_time": (
                datetime.now(timezone.utc) + timedelta(hours=1)
            ).isoformat(),
        },
    )
    booking_id = b_res.json()["id"]

    driver_id = client.get(
        "/api/v1/users?role=DRIVER", headers={"Authorization": f"Bearer {op_token}"}
    ).json()[0]["id"]
    tankers = client.get(
        "/api/v1/tankers", headers={"Authorization": f"Bearer {op_token}"}
    ).json()
    tanker_id = next(t["id"] for t in tankers if t["registration_number"] == "TK-1001")

    client.post(
        "/api/v1/dispatch/assign",
        headers={"Authorization": f"Bearer {op_token}"},
        json={"booking_id": booking_id, "driver_id": driver_id, "tanker_id": tanker_id},
    )

    # Attempt to jump from ASSIGNED directly to COMPLETED
    res = client.patch(
        f"/api/v1/deliveries/{booking_id}/status",
        headers={"Authorization": f"Bearer {drv_token}"},
        json={"status": "COMPLETED"},
    )
    assert res.status_code == 400
    assert "Invalid state transition" in res.json()["detail"]
