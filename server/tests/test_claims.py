from datetime import date


def test_claim_lifecycle_and_audit_log(client):
    today_str = date.today().isoformat()
    # Create product
    p_res = client.post(
        "/api/v1/products",
        json={
            "product_name": "Sony TV 55",
            "serial_number": "SNY-55-1234",
            "brand": "Sony",
            "category": "Television",
            "purchase_date": today_str,
            "duration_months": 36,
        },
    ).json()
    product_id = p_res["id"]

    # Submit claim
    claim_payload = {
        "product_id": product_id,
        "claim_date": today_str,
        "issue_description": "Screen display flickering on left side.",
        "service_provider": "Sony Care Center",
    }
    c_res = client.post("/api/v1/claims", json=claim_payload)
    assert c_res.status_code == 201
    claim = c_res.json()
    assert claim["status"] == "PENDING"
    assert claim["issue_description"] == "Screen display flickering on left side."
    claim_id = claim["id"]

    # Get claim
    get_res = client.get(f"/api/v1/claims/{claim_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == claim_id

    # Update claim status -> APPROVED
    up_res = client.patch(
        f"/api/v1/claims/{claim_id}/status",
        json={
            "status": "APPROVED",
            "resolution_notes": "Claim approved, dispatching replacement panel.",
            "repair_cost": 150.00,
        },
    )
    assert up_res.status_code == 200
    updated_claim = up_res.json()
    assert updated_claim["status"] == "APPROVED"
    assert updated_claim["repair_cost"] == 150.00

    # Update claim status -> COMPLETED
    up_res2 = client.patch(
        f"/api/v1/claims/{claim_id}/status",
        json={
            "status": "COMPLETED",
            "resolution_notes": "Panel replaced successfully.",
            "repair_cost": 150.00,
        },
    )
    assert up_res2.status_code == 200
    assert up_res2.json()["status"] == "COMPLETED"

    # Audit history
    audit_res = client.get(f"/api/v1/claims/{claim_id}/audit_logs")
    assert audit_res.status_code == 200
    logs = audit_res.json()
    assert len(logs) >= 3  # CLAIM_CREATED, APPROVED, COMPLETED
    actions = [l["to_status"] for l in logs]
    assert "PENDING" in actions
    assert "APPROVED" in actions
    assert "COMPLETED" in actions


def test_claims_list_filtering(client):
    today_str = date.today().isoformat()
    p_res = client.post(
        "/api/v1/products",
        json={
            "product_name": "Bose Headphones",
            "serial_number": "BOSE-9988",
            "purchase_date": today_str,
            "duration_months": 12,
        },
    ).json()
    product_id = p_res["id"]

    client.post(
        "/api/v1/claims",
        json={
            "product_id": product_id,
            "claim_date": today_str,
            "issue_description": "Battery drain issue",
        },
    )

    list_res = client.get(f"/api/v1/claims?product_id={product_id}")
    assert list_res.status_code == 200
    claims = list_res.json()
    assert len(claims) >= 1
    assert claims[0]["product_id"] == product_id
