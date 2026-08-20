"""
Module: server.tests.test_claims
Purpose: Tests for submitting and updating warranty claims, including status transition validation.
"""

from fastapi import status
from server.tests.test_products import get_auth_headers


def test_submit_claim_success(client):
    # AC: Users can submit and maintain service or warranty claim records against registered products
    headers = get_auth_headers(client, "claim@example.com")

    # Register product
    prod_resp = client.post(
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
    product_id = prod_resp.json()["id"]

    # Submit claim
    claim_resp = client.post(
        "/api/v1/claims",
        json={
            "product_id": product_id,
            "claim_date": "2024-08-10",
            "issue_description": "Display Flickering",
            "service_cost": 0.0,
        },
        headers=headers,
    )
    assert claim_resp.status_code == status.HTTP_201_CREATED
    data = claim_resp.json()
    assert data["issue_description"] == "Display Flickering"
    assert data["status"] == "Pending"
    assert data["service_cost"] == 0.0


def test_claim_status_transitions(client):
    # AC: Claim statuses must follow: Pending -> Approved / Rejected -> Completed
    headers = get_auth_headers(client, "transition@example.com")

    # Register product
    prod_resp = client.post(
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
    product_id = prod_resp.json()["id"]

    # Submit claim (starts as Pending)
    claim_resp = client.post(
        "/api/v1/claims",
        json={
            "product_id": product_id,
            "claim_date": "2024-08-10",
            "issue_description": "Display Flickering",
            "service_cost": 0.0,
        },
        headers=headers,
    )
    claim_id = claim_resp.json()["id"]

    # 1. Try invalid transition: Pending -> Completed (should fail)
    resp = client.put(
        f"/api/v1/claims/{claim_id}", json={"status": "Completed"}, headers=headers
    )
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "Must be Approved or Rejected" in resp.json()["detail"]

    # 2. Valid transition: Pending -> Approved
    resp = client.put(
        f"/api/v1/claims/{claim_id}",
        json={"status": "Approved", "resolution_notes": "Approved for repair"},
        headers=headers,
    )
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["status"] == "Approved"

    # 3. Try invalid transition: Approved -> Pending (should fail)
    resp = client.put(
        f"/api/v1/claims/{claim_id}", json={"status": "Pending"}, headers=headers
    )
    assert resp.status_code == status.HTTP_400_BAD_REQUEST

    # 4. Valid transition: Approved -> Completed
    resp = client.put(
        f"/api/v1/claims/{claim_id}",
        json={"status": "Completed", "service_cost": 150.0},
        headers=headers,
    )
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["status"] == "Completed"
    assert resp.json()["service_cost"] == 150.0
