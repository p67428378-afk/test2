import uuid
from fastapi.testclient import TestClient


def test_record_progress_success(client: TestClient):
    # Fetch valid module
    mod_resp = client.get("/api/v1/modules?subject=anatomy")
    module_id = mod_resp.json()[0]["id"]

    payload = {
        "module_id": module_id,
        "score": 85,
        "completed_checkpoints": ["chk_bp_1", "chk_bp_2"],
        "completed_at": "2026-08-31T12:00:00Z",
    }
    response = client.post("/api/v1/progress", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "recorded"
    assert data["score"] == 85
    assert data["module_id"] == module_id
    assert "progress_id" in data
    assert "chk_bp_1" in data["completed_checkpoints"]


def test_record_progress_invalid_uuid(client: TestClient):
    payload = {"module_id": "not-a-valid-uuid-1234", "score": 75}
    response = client.post("/api/v1/progress", json=payload)
    assert response.status_code == 422


def test_record_progress_module_not_found(client: TestClient):
    random_uuid = str(uuid.uuid4())
    payload = {"module_id": random_uuid, "score": 90}
    response = client.post("/api/v1/progress", json=payload)
    assert response.status_code == 404


def test_get_progress_summary(client: TestClient):
    # Record some progress first
    mod_resp = client.get("/api/v1/modules?subject=physiology")
    phys_id = mod_resp.json()[0]["id"]

    client.post(
        "/api/v1/progress",
        json={
            "module_id": phys_id,
            "score": 95,
            "completed_checkpoints": ["chk_cardiac_1"],
        },
    )

    summary_resp = client.get("/api/v1/progress/summary")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["enrolled_modules"] >= 1
    assert summary["average_score"] >= 0
    assert summary["completed_checkpoints"] >= 1
    assert "recent_progress" in summary


def test_get_module_progress(client: TestClient):
    mod_resp = client.get("/api/v1/modules?subject=anatomy")
    anatomy_id = mod_resp.json()[0]["id"]

    resp = client.get(f"/api/v1/progress/module/{anatomy_id}")
    assert resp.status_code == 200
    if resp.json() is not None:
        assert resp.json()["module_id"] == anatomy_id
