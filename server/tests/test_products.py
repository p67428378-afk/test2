"""
Module: server.tests.test_products
Purpose: Tests for product registration, warranty calculation, search, and filtering.
"""

from datetime import date, timedelta
from fastapi import status


def get_auth_headers(client, email="test@example.com", password="testpassword"):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": "Test User"},
    )
    # Login
    response = client.post(
        "/api/v1/auth/login", data={"username": email, "password": password}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_product_success(client):
    # AC: Product Registration & Warranty Storage happy path
    headers = get_auth_headers(client, "prodreg@example.com")
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Dell XPS 15",
            "serial_number": "SN-98765",
            "manufacturer": "Dell",
            "category": "Laptops",
            "purchase_date": "2024-01-15",
            "warranty_duration_months": 24,
            "is_lifetime": False,
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Dell XPS 15"
    assert data["warranty"]["duration_months"] == 24
    assert data["warranty"]["expiry_date"] == "2026-01-15"
    assert (
        data["warranty"]["status"] == "Expired"
    )  # Since 2026-01-15 is in the past relative to 2026-08-20


def test_register_product_future_date(client):
    # AC: Submitting a registration with a future purchase date triggers 422 Unprocessable Entity
    headers = get_auth_headers(client, "futuredate@example.com")
    future_date = (date.today() + timedelta(days=5)).isoformat()
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Dell XPS 15",
            "serial_number": "SN-98765",
            "manufacturer": "Dell",
            "category": "Laptops",
            "purchase_date": future_date,
            "warranty_duration_months": 24,
            "is_lifetime": False,
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "Purchase date cannot be in the future" in response.json()["detail"]


def test_register_product_lifetime_warranty(client):
    # AC: Products marked as "Lifetime Warranty" are handled cleanly without triggering negative day calculations
    headers = get_auth_headers(client, "lifetime@example.com")
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Lifetime Item",
            "serial_number": "SN-LIFETIME",
            "manufacturer": "Apple",
            "category": "Phones",
            "purchase_date": "2024-01-15",
            "warranty_duration_months": None,
            "is_lifetime": True,
        },
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["warranty"]["is_lifetime"] is True
    assert data["warranty"]["expiry_date"] is None
    assert data["warranty"]["status"] == "Active"


def test_list_and_filter_products(client):
    # AC: Users can search and filter registered products by status, brand/manufacturer, category, or purchase date
    headers = get_auth_headers(client, "filter@example.com")

    # Register an active product (expiry in future)
    future_purchase = (date.today() - timedelta(days=10)).isoformat()
    client.post(
        "/api/v1/products",
        json={
            "name": "Active Laptop",
            "serial_number": "SN-ACTIVE",
            "manufacturer": "Dell",
            "category": "Laptops",
            "purchase_date": future_purchase,
            "warranty_duration_months": 12,
            "is_lifetime": False,
        },
        headers=headers,
    )

    # Register an expired product
    client.post(
        "/api/v1/products",
        json={
            "name": "Expired Phone",
            "serial_number": "SN-EXPIRED",
            "manufacturer": "Apple",
            "category": "Phones",
            "purchase_date": "2020-01-01",
            "warranty_duration_months": 12,
            "is_lifetime": False,
        },
        headers=headers,
    )

    # List all
    response = client.get("/api/v1/products", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 2

    # Filter by status
    response = client.get("/api/v1/products?status=Expired", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["name"] == "Expired Phone"

    # Search by keyword
    response = client.get("/api/v1/products?search=Apple", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["name"] == "Expired Phone"
