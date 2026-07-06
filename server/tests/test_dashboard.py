"""
test_dashboard.py — Tests for the real-time dashboard endpoint.
Uses the shared StaticPool in-memory engine from conftest.py.
"""
from fastapi.testclient import TestClient
from server.main import app
from server.models import EnergySource, RealtimeMetric
from server.tests.conftest import TestingSessionLocal


def _seed_dashboard_data():
    db = TestingSessionLocal()
    try:
        solar = EnergySource(name="Solar Array A", type="solar", status="active")
        wind = EnergySource(name="Wind Turbine B", type="wind", status="active")
        battery = EnergySource(name="Battery Storage C", type="battery", status="active")
        grid = EnergySource(name="Grid Connection D", type="grid", status="active")
        db.add_all([solar, wind, battery, grid])
        db.commit()
        for src in [solar, wind, battery, grid]:
            db.refresh(src)

        metrics = [
            RealtimeMetric(energy_source_id=solar.id, metric_name="power_output_kw", metric_value=5.5),
            RealtimeMetric(energy_source_id=solar.id, metric_name="illumination_lux", metric_value=48000.0),
            RealtimeMetric(energy_source_id=solar.id, metric_name="daily_energy_kwh", metric_value=35.0),
            RealtimeMetric(energy_source_id=wind.id, metric_name="power_output_kw", metric_value=1.5),
            RealtimeMetric(energy_source_id=wind.id, metric_name="wind_speed_ms", metric_value=9.0),
            RealtimeMetric(energy_source_id=wind.id, metric_name="turbine_rpm", metric_value=1300.0),
            RealtimeMetric(energy_source_id=battery.id, metric_name="charge_level_pct", metric_value=90.0),
            RealtimeMetric(energy_source_id=battery.id, metric_name="remaining_time_mins", metric_value=150.0),
            RealtimeMetric(energy_source_id=battery.id, metric_name="status", metric_value=1.0),
            RealtimeMetric(energy_source_id=grid.id, metric_name="power_draw_kw", metric_value=0.8),
            RealtimeMetric(energy_source_id=grid.id, metric_name="status", metric_value=1.0),
        ]
        db.add_all(metrics)
        db.commit()
    finally:
        db.close()


def test_get_realtime_dashboard():
    _seed_dashboard_data()
    client = TestClient(app)
    response = client.get("/api/v1/dashboard/realtime")
    assert response.status_code == 200
    data = response.json()
    assert "solar" in data
    assert "wind" in data
    assert "battery" in data
    assert "grid" in data
    assert data["solar"]["power_output_kw"] == 5.5
    assert data["wind"]["wind_speed_ms"] == 9.0
    assert data["battery"]["charge_level_pct"] == 90.0
    assert data["grid"]["power_draw_kw"] == 0.8
