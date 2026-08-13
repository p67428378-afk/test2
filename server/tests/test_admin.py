def get_token(client, email, password):
    resp = client.post(
        "/api/v1/auth/login/json", json={"email": email, "password": password}
    )
    return resp.json()["access_token"]


def test_admin_analytics_success(client):
    admin_token = get_token(client, "admin@example.com", "adminpassword")

    response = client.get(
        "/api/v1/admin/analytics", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_active_bookings" in data
    assert "fleet_utilization_rate" in data
    assert "avg_fulfillment_duration_mins" in data
    assert "total_volume_liters" in data


def test_admin_analytics_forbidden_for_customer(client):
    cust_token = get_token(client, "test@example.com", "testpassword")

    response = client.get(
        "/api/v1/admin/analytics", headers={"Authorization": f"Bearer {cust_token}"}
    )
    assert response.status_code == 403
