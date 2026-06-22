def test_process_payment(client):
    # Register and login to get token
    register_data = {
        "email": "test@example.com",
        "password": "securepassword",
        "name": "Test User",
    }
    client.post("/api/v1/auth/register", json=register_data)
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "securepassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get a package ID
    packages_response = client.get("/api/v1/packages")
    package_id = packages_response.json()["items"][0]["id"]

    # Create booking
    booking_data = {
        "package_id": package_id,
        "start_date": "2026-07-01",
        "end_date": "2026-07-08",
        "number_of_travelers": 2,
        "traveler_info": {
            "primary_traveler": {
                "name": "Test User",
                "email": "test@example.com",
                "phone": "1234567890",
            }
        },
    }
    booking_response = client.post(
        "/api/v1/bookings", json=booking_data, headers=headers
    )
    booking_data_res = booking_response.json()
    booking_id = booking_data_res["booking_id"]
    total_price = booking_data_res["total_price"]

    # Process payment with correct amount
    payment_data = {
        "booking_id": booking_id,
        "payment_method": "credit_card",
        "amount": total_price,
        "card_number": "1234567812345678",
        "cvv": "123",
        "expiry_date": "12/28",
    }
    response = client.post("/api/v1/payments", json=payment_data, headers=headers)
    assert response.status_code == 200
    payment_res = response.json()
    assert payment_res["status"] == "completed"
    assert payment_res["booking_id"] == booking_id
    assert "payment_id" in payment_res
    assert "transaction_id" in payment_res

    # Verify booking status is now confirmed
    response = client.get(f"/api/v1/bookings/{booking_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"


def test_process_payment_amount_mismatch(client):
    # Register and login to get token
    register_data = {
        "email": "test@example.com",
        "password": "securepassword",
        "name": "Test User",
    }
    client.post("/api/v1/auth/register", json=register_data)
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "securepassword"},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get a package ID
    packages_response = client.get("/api/v1/packages")
    package_id = packages_response.json()["items"][0]["id"]

    # Create booking
    booking_data = {
        "package_id": package_id,
        "start_date": "2026-07-01",
        "end_date": "2026-07-08",
        "number_of_travelers": 2,
        "traveler_info": {
            "primary_traveler": {
                "name": "Test User",
                "email": "test@example.com",
                "phone": "1234567890",
            }
        },
    }
    booking_response = client.post(
        "/api/v1/bookings", json=booking_data, headers=headers
    )
    booking_id = booking_response.json()["booking_id"]

    # Process payment with incorrect amount
    payment_data = {
        "booking_id": booking_id,
        "payment_method": "credit_card",
        "amount": 1.00,  # wrong amount
        "card_number": "1234567812345678",
        "cvv": "123",
        "expiry_date": "12/28",
    }
    response = client.post("/api/v1/payments", json=payment_data, headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Payment processing failed or amount mismatch"
