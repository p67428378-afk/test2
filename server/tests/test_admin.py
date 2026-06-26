"""
Module: test_admin
Purpose: Test admin endpoints.
"""


def test_get_admin_metrics(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/admin/metrics", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "active_customers" in data
    assert "low_stock_count" in data
    assert "total_orders" in data
    assert "total_sales" in data


def test_get_admin_orders(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/admin/orders", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_admin_endpoints_forbidden_for_customer(client, user_token):
    headers = {"Authorization": f"Bearer {user_token}"}

    response = client.get("/api/v1/admin/metrics", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized as admin"

    response = client.get("/api/v1/admin/orders", headers=headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized as admin"
