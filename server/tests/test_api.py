from datetime import date, timedelta


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "hotel-management-api"


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Hotel Management System API" in response.json()["message"]


def test_auth_login_success(client):
    # Test desk clerk login
    resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["role"] == "desk_clerk"

    # Test admin login
    resp_admin = client.post(
        "/api/v1/auth/login",
        json={
            "email": "admin@example.com",
            "password": "adminpassword",
        },
    )
    assert resp_admin.status_code == 200
    assert resp_admin.json()["user"]["role"] == "admin"


def test_auth_login_failure(client):
    resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )
    assert resp.status_code == 401
    assert "Incorrect email or password" in resp.json()["detail"]


def test_auth_get_me(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword",
        },
    )
    token = login_resp.json()["access_token"]

    resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"


def test_rooms_crud_and_status(client):
    # 1. Create Room
    new_room = {
        "room_number": "301",
        "room_type": "Presidential Suite",
        "daily_rate": 500.0,
        "status": "Available",
    }
    create_resp = client.post("/api/v1/rooms", json=new_room)
    assert create_resp.status_code == 201
    room_data = create_resp.json()
    room_id = room_data["id"]
    assert room_data["room_number"] == "301"

    # 2. Duplicate Room Number should fail
    dup_resp = client.post("/api/v1/rooms", json=new_room)
    assert dup_resp.status_code == 409

    # 3. Get Room by ID
    get_resp = client.get(f"/api/v1/rooms/{room_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["room_number"] == "301"

    # 4. List Rooms with filters
    list_resp = client.get("/api/v1/rooms?status=Available")
    assert list_resp.status_code == 200
    assert any(r["room_number"] == "301" for r in list_resp.json())

    # 5. Patch Room Status
    patch_resp = client.patch(
        f"/api/v1/rooms/{room_id}/status", json={"status": "Maintenance"}
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "Maintenance"

    # 6. Invalid Status should fail
    invalid_patch = client.patch(
        f"/api/v1/rooms/{room_id}/status", json={"status": "InvalidStatus"}
    )
    assert invalid_patch.status_code == 400


def test_reservation_workflow(client):
    start = date.today() + timedelta(days=10)
    end = date.today() + timedelta(days=13)

    # 1. Create Reservation
    res_payload = {
        "guest": {
            "full_name": "Alice Smith",
            "email": "alice.smith@example.com",
            "phone": "+1-555-1234",
        },
        "room_type": "Single Deluxe",
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
    }
    create_resp = client.post("/api/v1/reservations", json=res_payload)
    assert create_resp.status_code == 201
    res_data = create_resp.json()
    res_id = res_data["id"]
    assert res_data["status"] == "CONFIRMED"
    assert res_data["guest"]["full_name"] == "Alice Smith"

    # 2. Get Reservation
    get_resp = client.get(f"/api/v1/reservations/{res_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == res_id

    # 3. List Reservations with search filter
    search_resp = client.get("/api/v1/reservations?guest_name=Alice")
    assert search_resp.status_code == 200
    assert len(search_resp.json()) >= 1

    # 4. Update Reservation dates
    new_end = end + timedelta(days=1)
    update_resp = client.put(
        f"/api/v1/reservations/{res_id}",
        json={
            "end_date": new_end.isoformat(),
        },
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["end_date"] == new_end.isoformat()

    # 5. Cancel Reservation
    cancel_resp = client.post(f"/api/v1/reservations/{res_id}/cancel")
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "CANCELLED"


def test_checkin_checkout_and_billing(client):
    # 1. Create room and reservation for check-in test
    room_resp = client.post(
        "/api/v1/rooms",
        json={
            "room_number": "401",
            "room_type": "Luxury Suite",
            "daily_rate": 300.0,
            "status": "Available",
        },
    )
    room_id = room_resp.json()["id"]

    start = date.today()
    end = date.today() + timedelta(days=2)

    res_resp = client.post(
        "/api/v1/reservations",
        json={
            "guest": {
                "full_name": "Bob Vance",
                "email": "bob.vance@example.com",
                "phone": "+1-555-9876",
            },
            "room_type": "Luxury Suite",
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "room_id": room_id,
        },
    )
    assert res_resp.status_code == 201
    res_id = res_resp.json()["id"]

    # 2. Check-in
    checkin_resp = client.post(
        "/api/v1/check-in",
        json={
            "reservation_id": res_id,
            "room_id": room_id,
        },
    )
    assert checkin_resp.status_code == 200
    assert checkin_resp.json()["status"] == "CHECKED_IN"
    assert checkin_resp.json()["room_number"] == "401"

    # Verify Room is now Occupied
    room_check = client.get(f"/api/v1/rooms/{room_id}")
    assert room_check.json()["status"] == "Occupied"

    # 3. Check-out
    checkout_resp = client.post(
        "/api/v1/check-out",
        json={
            "reservation_id": res_id,
            "service_fees": 30.0,
            "promo_code": "WELCOME10",
        },
    )
    assert checkout_resp.status_code == 200
    assert checkout_resp.json()["room_status"] == "Cleaning"

    # Verify Room is now Cleaning
    room_check_post = client.get(f"/api/v1/rooms/{room_id}")
    assert room_check_post.json()["status"] == "Cleaning"

    # 4. Get Invoice
    invoice_resp = client.get(f"/api/v1/invoices/{res_id}")
    assert invoice_resp.status_code == 200
    invoice_data = invoice_resp.json()
    assert invoice_data["reservation_id"] == res_id
    assert invoice_data["payment_status"] == "UNPAID"
    assert len(invoice_data["items"]) >= 2  # room charges, tax, service fees, discount

    # 5. Pay Invoice
    pay_resp = client.post(
        f"/api/v1/invoices/{res_id}/pay",
        json={
            "payment_method": "credit_card",
            "card_last4": "1234",
        },
    )
    assert pay_resp.status_code == 200
    assert pay_resp.json()["payment_status"] == "PAID"
