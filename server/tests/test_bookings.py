def test_create_and_get_booking(client):
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
            },
            "additional_travelers": [{"name": "Additional Traveler"}],
        },
    }
    response = client.post("/api/v1/bookings", json=booking_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "booking_id" in data
    assert data["status"] == "pending"
    assert "total_price" in data
    booking_id = data["booking_id"]

    # Get booking detail
    response = client.get(f"/api/v1/bookings/{booking_id}", headers=headers)
    assert response.status_code == 200
    detail = response.json()
    assert detail["id"] == booking_id
    assert detail["package_id"] == package_id
    assert detail["number_of_travelers"] == 2

    # Get user bookings
    response = client.get("/api/v1/users/me/bookings", headers=headers)
    assert response.status_code == 200
    bookings_list = response.json()
    assert len(bookings_list) == 1
    assert bookings_list[0]["id"] == booking_id


def test_create_booking_unauthorized(client):
    booking_data = {
        "package_id": "some-id",
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
    response = client.post("/api/v1/bookings", json=booking_data)
    assert response.status_code == 401
