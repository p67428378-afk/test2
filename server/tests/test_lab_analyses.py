import pytest


def test_lab_analysis_lifecycle(client):
    # Get an artifact ID
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()["items"][0]["id"]

    # 1. Create Analysis Request (Pending)
    req_payload = {
        "artifact_id": artifact_id,
        "test_type": "XRF Spectrometry",
        "lab_name": "University Archaeometry Center",
        "status": "Pending",
        "request_date": "2026-04-01",
    }
    create_res = client.post("/api/v1/lab-analyses", json=req_payload)
    assert create_res.status_code == 201
    analysis_data = create_res.json()
    analysis_id = analysis_data["id"]
    assert analysis_data["status"] == "Pending"

    # 2. Transition to In-Progress
    prog_res = client.patch(f"/api/v1/lab-analyses/{analysis_id}", json={
        "status": "In-Progress"
    })
    assert prog_res.status_code == 200
    assert prog_res.json()["status"] == "In-Progress"

    # 3. Transition to Completed with findings
    comp_res = client.patch(f"/api/v1/lab-analyses/{analysis_id}", json={
        "status": "Completed",
        "completion_date": "2026-04-12",
        "result_summary": "High copper-tin alloy purity (88% Cu, 11% Sn) with trace arsenic indicative of Cypriot ore sources."
    })
    assert comp_res.status_code == 200
    final_data = comp_res.json()
    assert final_data["status"] == "Completed"
    assert "Cypriot ore" in final_data["result_summary"]


def test_invalid_lab_status_validation(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()["items"][0]["id"]

    # Invalid status in POST
    bad_post = client.post("/api/v1/lab-analyses", json={
        "artifact_id": artifact_id,
        "test_type": "Petrographic Analysis",
        "lab_name": "GeoLab",
        "status": "InvalidStatus",
        "request_date": "2026-04-01",
    })
    assert bad_post.status_code == 422


def test_list_and_filter_lab_analyses(client):
    res = client.get("/api/v1/lab-analyses?status=Completed")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert all(item["status"] == "Completed" for item in data["items"])


def test_delete_lab_analysis(client):
    artifacts_res = client.get("/api/v1/artifacts")
    artifact_id = artifacts_res.json()["items"][0]["id"]

    create_res = client.post("/api/v1/lab-analyses", json={
        "artifact_id": artifact_id,
        "test_type": "Petrographic Analysis",
        "lab_name": "GeoLab",
        "status": "Pending",
        "request_date": "2026-04-01",
    })
    analysis_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/lab-analyses/{analysis_id}")
    assert del_res.status_code == 204
    assert client.get(f"/api/v1/lab-analyses/{analysis_id}").status_code == 404
