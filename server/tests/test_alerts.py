def test_security_alert_lifecycle(client):
    # 1. Create Alert
    response = client.post(
        "/api/v1/alerts",
        json={
            "severity": "HIGH",
            "alert_type": "UNAUTHORIZED_ENTRY",
            "location_tag": "North Gate",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["severity"] == "HIGH"
    assert data["alert_type"] == "UNAUTHORIZED_ENTRY"
    assert data["status"] == "ACTIVE"
    alert_id = data["id"]

    # 2. Cancel Alert within 60 seconds
    cancel_response = client.post(
        f"/api/v1/alerts/{alert_id}/cancel",
        json={"cancel_reason": "False alarm triggered accidentally"},
    )
    assert cancel_response.status_code == 200
    c_data = cancel_response.json()
    assert c_data["status"] == "CANCELLED"
    assert c_data["cancel_reason"] == "False alarm triggered accidentally"


def test_cancel_non_existent_alert(client):
    response = client.post(
        "/api/v1/alerts/invalid-alert-id/cancel",
        json={"cancel_reason": "Testing invalid ID"},
    )
    assert response.status_code == 404
