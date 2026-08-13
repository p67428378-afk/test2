import pytest


def test_get_crowd_density(client):
    response = client.get("/api/v1/crowd/density")
    assert response.status_code == 200
    data = response.json()
    assert "total_attendees" in data
    assert "active_stages" in data
    assert "stages" in data
    assert isinstance(data["stages"], list)
    assert len(data["stages"]) >= 1

    stage_0 = data["stages"][0]
    assert "stage_id" in stage_0
    assert "stage_name" in stage_0
    assert "occupancy_ratio" in stage_0
    assert "alert_status" in stage_0
