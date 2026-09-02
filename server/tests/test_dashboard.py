import pytest


def test_health_endpoints(client):
    res1 = client.get("/health")
    assert res1.status_code == 200
    assert res1.json()["status"] == "healthy"

    res2 = client.get("/api/v1/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "healthy"


def test_dashboard_metrics(client):
    res = client.get("/api/v1/dashboard/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "active_sites_count" in data
    assert "cataloged_artifacts_count" in data
    assert "excavation_teams_count" in data
    assert "pending_lab_tests_count" in data
    assert "total_publications_count" in data
    assert "total_photos_count" in data
    assert data["active_sites_count"] >= 1
    assert data["cataloged_artifacts_count"] >= 1
