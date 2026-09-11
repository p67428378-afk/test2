from datetime import date, timedelta


def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_create_contract_success(client, auth_headers):
    today = date.today()
    next_year = today + timedelta(days=365)

    payload = {
        "title": "Vendor Supply Agreement 2026",
        "vendor_name": "Acme Corp",
        "effective_date": today.isoformat(),
        "termination_date": next_year.isoformat(),
        "total_value": 150000.0,
        "terms": "Standard SLA terms apply.",
        "document_url": "https://example.com/contract.pdf",
    }

    response = client.post("/api/v1/contracts", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Vendor Supply Agreement 2026"
    assert data["status"] == "Draft"
    assert data["current_version"] == "v1.0"
    assert data["version_number"] == 1
    assert "contract_number" in data


def test_create_contract_validation_error(client, auth_headers):
    today = date.today()
    prev_year = today - timedelta(days=365)

    # Termination date before effective date
    payload = {
        "title": "Invalid Contract",
        "vendor_name": "Acme Corp",
        "effective_date": today.isoformat(),
        "termination_date": prev_year.isoformat(),
        "total_value": 1000.0,
    }

    response = client.post("/api/v1/contracts", json=payload, headers=auth_headers)
    assert response.status_code == 400


def test_get_contracts_list(client, auth_headers):
    response = client.get("/api/v1/contracts", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1


def test_update_contract_and_occ(client, auth_headers):
    today = date.today()
    next_year = today + timedelta(days=365)

    create_payload = {
        "title": "OCC Test Contract",
        "vendor_name": "Acme Corp",
        "effective_date": today.isoformat(),
        "termination_date": next_year.isoformat(),
        "total_value": 50000.0,
    }
    c_resp = client.post("/api/v1/contracts", json=create_payload, headers=auth_headers)
    contract_id = c_resp.json()["id"]

    # First update - version 1 -> 2
    update_payload = {
        "title": "OCC Test Contract Updated",
        "current_version_num": 1,
        "change_summary": "Updated title",
    }
    u_resp = client.put(
        f"/api/v1/contracts/{contract_id}", json=update_payload, headers=auth_headers
    )
    assert u_resp.status_code == 200
    assert u_resp.json()["version_number"] == 2
    assert u_resp.json()["current_version"] == "v1.1"

    # Stale update with version 1 -> should fail with 409 Conflict
    stale_payload = {
        "title": "Conflicting Title",
        "current_version_num": 1,
        "change_summary": "Stale update attempt",
    }
    stale_resp = client.put(
        f"/api/v1/contracts/{contract_id}", json=stale_payload, headers=auth_headers
    )
    assert stale_resp.status_code == 409

    # Check version history list
    v_resp = client.get(
        f"/api/v1/contracts/{contract_id}/versions", headers=auth_headers
    )
    assert v_resp.status_code == 200
    versions = v_resp.json()
    assert len(versions) == 2
