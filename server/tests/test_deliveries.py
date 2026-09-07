import uuid
from datetime import datetime, timezone, timedelta
import server.models as models


def test_log_delivery_package(client):
    payload = {
        "unit_number": "Unit 5A",
        "courier_name": "UPS",
        "tracking_number": "UPS-123456789",
        "package_description": "Medium box",
    }
    response = client.post("/api/v1/deliveries", json=payload)
    assert response.status_code == 201, response.text
    data = response.json()

    assert data["unit_number"] == "Unit 5A"
    assert data["courier_name"] == "UPS"
    assert data["tracking_number"] == "UPS-123456789"
    assert data["status"] == "PENDING_PICKUP"
    assert data["is_overdue"] is False


def test_list_deliveries_and_filter(client):
    response = client.get("/api/v1/deliveries?unit_number=Unit%205A")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["unit_number"] == "Unit 5A"


def test_collect_delivery_package(client):
    # Log package first
    payload = {
        "unit_number": "Unit 6B",
        "courier_name": "DHL",
        "tracking_number": "DHL-987654321",
    }
    res = client.post("/api/v1/deliveries", json=payload)
    assert res.status_code == 201
    delivery_id = res.json()["delivery_id"]

    # Collect package
    collect_res = client.post(f"/api/v1/deliveries/{delivery_id}/collect")
    assert collect_res.status_code == 200
    collect_data = collect_res.json()

    assert collect_data["status"] == "COLLECTED"
    assert collect_data["collected_at"] is not None


def test_overdue_deliveries(client, db_session):
    # Manually insert an overdue delivery logged 50 hours ago
    overdue_time = datetime.now(timezone.utc) - timedelta(hours=50)
    overdue_id = str(uuid.uuid4())

    delivery = models.Delivery(
        id=overdue_id,
        unit_number="Unit 7C",
        courier_name="Amazon",
        tracking_number="AMZ-9999",
        status="PENDING_PICKUP",
        logged_at=overdue_time,
    )
    db_session.add(delivery)
    db_session.commit()

    response = client.get("/api/v1/deliveries/overdue")
    assert response.status_code == 200
    data = response.json()

    overdue_ids = [d["delivery_id"] for d in data]
    assert overdue_id in overdue_ids
