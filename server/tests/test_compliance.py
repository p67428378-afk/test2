def test_compliance_check_passed(client):
    payload = {
        "amount": 1000.0,
        "beneficiary_name": "John Doe",
        "currency": "USD",
        "destination_country": "DE",
    }
    response = client.post("/api/v1/compliance-checks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Passed"
    assert data["sanction_screen_status"] == "Passed"


def test_compliance_check_sanctioned_beneficiary(client):
    payload = {
        "amount": 1000.0,
        "beneficiary_name": "SANCTIONED CORP",
        "currency": "USD",
        "destination_country": "DE",
    }
    response = client.post("/api/v1/compliance-checks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Failed"
    assert data["sanction_screen_status"] == "Failed"


def test_compliance_check_sanctioned_country(client):
    payload = {
        "amount": 1000.0,
        "beneficiary_name": "John Doe",
        "currency": "USD",
        "destination_country": "KP",
    }
    response = client.post("/api/v1/compliance-checks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Failed"
    assert data["sanction_screen_status"] == "Failed"


def test_compliance_reports(client):
    response = client.get(
        "/api/v1/compliance/reports?start_date=2026-01-01T00:00:00Z&end_date=2026-12-31T23:59:59Z&format=pdf"
    )
    assert response.status_code == 200
    data = response.json()
    assert "report_id" in data
    assert "download_url" in data
