import uuid
from datetime import datetime, timezone, timedelta
import server.models as models


def test_create_security_alert(client):
    payload = {
        "alert_type": "PANIC_EMERGENCY",
        "severity": "CRITICAL",
        "location": "South Gate",
        "description": "Resident panic button triggered near clubhouse",
    }

    response = client.post("/api/v1/alerts", json=payload)
    assert response.status_code == 201, response.text
    data = response.json()

    assert data["alert_type"] == "PANIC_EMERGENCY"
    assert data["severity"] == "CRITICAL"
    assert data["location"] == "South Gate"
    assert data["status"] == "ACTIVE"
    assert "can_cancel_until" in data


def test_list_security_alerts(client):
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_cancel_security_alert_within_60_seconds(client):
    # Trigger fresh alert
    payload = {
        "alert_type": "UNAUTHORIZED_ENTRY",
        "severity": "HIGH",
        "location": "Main Gate",
        "description": "Tailgating vehicle detected",
    }
    create_res = client.post("/api/v1/alerts", json=payload)
    assert create_res.status_code == 201
    alert_id = create_res.json()["alert_id"]

    # Cancel within 60 seconds
    cancel_payload = {
        "cancellation_reason": "Guard confirmed authorized tailgating with resident permission"
    }
    cancel_res = client.post(f"/api/v1/alerts/{alert_id}/cancel", json=cancel_payload)
    assert cancel_res.status_code == 200
    cancel_data = cancel_res.json()

    assert cancel_data["status"] == "CANCELLED"
    assert cancel_data["cancellation_reason"] == cancel_payload["cancellation_reason"]
    assert cancel_data["cancelled_by"] == "Supervisor John"


def test_cancel_security_alert_after_60_seconds_fails(client, db_session):
    # Insert an alert created 2 minutes ago
    old_time = datetime.now(timezone.utc) - timedelta(seconds=120)
    old_alert_id = str(uuid.uuid4())

    alert = models.SecurityAlert(
        id=old_alert_id,
        alert_type="UNAUTHORIZED_ENTRY",
        severity="MEDIUM",
        location="East Gate",
        description="Gate left open",
        status="ACTIVE",
        created_at=old_time,
        updated_at=old_time,
    )
    db_session.add(alert)
    db_session.commit()

    cancel_payload = {"cancellation_reason": "False alarm"}
    cancel_res = client.post(
        f"/api/v1/alerts/{old_alert_id}/cancel", json=cancel_payload
    )
    assert cancel_res.status_code == 400
    assert "Cancellation window expired" in cancel_res.json()["detail"]
