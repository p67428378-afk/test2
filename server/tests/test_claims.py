from datetime import date


def test_submit_and_manage_claim(client):
    today = date.today().isoformat()
    # Register product first
    product_res = client.post(
        "/api/v1/products",
        json={
            "product_name": "LG OLED TV",
            "serial_number": "LGOLED-55CX",
            "brand": "LG",
            "category": "Television",
            "purchase_date": today,
            "duration_months": 12,
        },
    )
    product_id = product_res.json()["id"]

    # Submit claim
    claim_payload = {
        "product_id": product_id,
        "claim_date": today,
        "issue_description": "Screen displaying flickering horizontal lines",
        "service_provider": "LG Authorized Service",
    }
    claim_res = client.post("/api/v1/claims", json=claim_payload)
    assert claim_res.status_code == 201
    claim_data = claim_res.json()
    assert claim_data["status"] == "PENDING"
    assert claim_data["product_id"] == product_id
    claim_id = claim_data["id"]

    # Get claim details
    detail_res = client.get(f"/api/v1/claims/{claim_id}")
    assert detail_res.status_code == 200
    assert (
        detail_res.json()["issue_description"]
        == "Screen displaying flickering horizontal lines"
    )

    # List claims for product
    list_res = client.get(f"/api/v1/claims?product_id={product_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Update claim status to APPROVED
    patch_res1 = client.patch(
        f"/api/v1/claims/{claim_id}/status",
        json={
            "status": "APPROVED",
            "resolution_notes": "Claim approved for panel replacement",
        },
    )
    assert patch_res1.status_code == 200
    assert patch_res1.json()["status"] == "APPROVED"

    # Update claim status to COMPLETED with repair cost
    patch_res2 = client.patch(
        f"/api/v1/claims/{claim_id}/status",
        json={
            "status": "COMPLETED",
            "repair_cost": 150.00,
            "resolution_notes": "Display panel replaced under warranty. Total repair cost covered.",
        },
    )
    assert patch_res2.status_code == 200
    assert patch_res2.json()["status"] == "COMPLETED"
    assert patch_res2.json()["repair_cost"] == 150.00

    # Get audit logs
    audit_res = client.get(f"/api/v1/claims/{claim_id}/audit_logs")
    assert audit_res.status_code == 200
    logs = audit_res.json()
    assert len(logs) >= 3  # SUBMITTED + APPROVED + COMPLETED
