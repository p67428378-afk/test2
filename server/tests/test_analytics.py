"""
test_analytics.py — Tests for the historical analytics endpoint.
Uses the shared StaticPool in-memory engine from conftest.py.
"""
from datetime import datetime
from fastapi.testclient import TestClient
from server.main import app
from server.models import EnergySource, HistoricalMetric
from server.tests.conftest import TestingSessionLocal


def _seed_analytics_data():
    db = TestingSessionLocal()
    try:
        solar = EnergySource(name="Solar Array A", type="solar", status="active")
        db.add(solar)
        db.commit()
        db.refresh(solar)

        h1 = HistoricalMetric(
            energy_source_id=solar.id,
            metric_name="generation_kwh",
            metric_value=45.2,
            timestamp=datetime(2026, 1, 1, 0, 0, 0),
        )
        h2 = HistoricalMetric(
            energy_source_id=solar.id,
            metric_name="consumption_kwh",
            metric_value=35.1,
            timestamp=datetime(2026, 1, 1, 0, 0, 0),
        )
        h3 = HistoricalMetric(
            energy_source_id=solar.id,
            metric_name="cost_usd",
            metric_value=5.2,
            timestamp=datetime(2026, 1, 1, 0, 0, 0),
        )
        db.add_all([h1, h2, h3])
        db.commit()
    finally:
        db.close()


def test_get_historical_analytics():
    _seed_analytics_data()
    client = TestClient(app)
    response = client.get(
        "/api/v1/analytics/history",
        params={
            "start_date": "2026-01-01T00:00:00Z",
            "end_date": "2026-01-01T23:59:59Z",
            "source": "solar",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "data_points" in data
    assert "summary" in data
    assert len(data["data_points"]) > 0
    assert data["summary"]["total_generation_kwh"] == 45.2
    assert data["summary"]["total_consumption_kwh"] == 35.1
    assert data["summary"]["net_cost_usd"] == 5.2
