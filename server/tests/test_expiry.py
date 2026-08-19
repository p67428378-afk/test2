from datetime import date
from server.services.expiry import run_expiry_evaluation
from server.crud import determine_warranty_status, calculate_end_date


def test_warranty_date_math_and_status():
    start = date(2025, 1, 15)
    end = calculate_end_date(start, 12)
    assert end == date(2026, 1, 15)

    today = date(2026, 1, 1)
    status = determine_warranty_status(end, today)
    assert status == "EXPIRING_SOON"

    today_past = date(2026, 2, 1)
    status_expired = determine_warranty_status(end, today_past)
    assert status_expired == "EXPIRED"

    today_active = date(2025, 6, 1)
    status_active = determine_warranty_status(end, today_active)
    assert status_active == "ACTIVE"


def test_trigger_expiry_evaluation_endpoint(client):
    res = client.post("/api/v1/expiry/evaluate")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "updated_warranties_count" in data


def test_expiry_daemon_runner(client):
    count = run_expiry_evaluation()
    assert isinstance(count, int)
