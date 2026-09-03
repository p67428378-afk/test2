"""Unit and integration tests for Dashboard metrics and real-time status widgets."""


def test_get_dashboard_metrics(client):
    response = client.get("/api/v1/dashboard/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_sessions" in data
    assert "completed_sessions" in data
    assert "in_progress_sessions" in data
    assert "total_revenue" in data
    assert "outstanding_balance" in data
    assert "active_packages_count" in data
    assert data["active_packages_count"] >= 4


def test_get_status_widgets(client):
    response = client.get("/api/v1/dashboard/status-widgets")
    assert response.status_code == 200
    widgets = response.json()
    assert len(widgets) >= 3
    widget_ids = [w["id"] for w in widgets]
    assert "slot-hold-monitor" in widget_ids
    assert "unpaid-balance-alerts" in widget_ids
    assert "gallery-sync-engine" in widget_ids
