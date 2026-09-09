def test_export_routine_pdf(client):
    routines_res = client.get("/api/v1/routines")
    routines = routines_res.json()
    assert len(routines) > 0
    routine_id = routines[0]["id"]

    res = client.get(f"/api/v1/routines/{routine_id}/export?format=pdf")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert "attachment; filename=" in res.headers["content-disposition"]
    # Verify PDF magic bytes
    assert res.content.startswith(b"%PDF")


def test_export_routine_json(client):
    routines_res = client.get("/api/v1/routines")
    routines = routines_res.json()
    assert len(routines) > 0
    routine_id = routines[0]["id"]

    res = client.get(f"/api/v1/routines/{routine_id}/export?format=json")
    assert res.status_code == 200
    assert "application/json" in res.headers["content-type"]
    assert "attachment; filename=" in res.headers["content-disposition"]
    data = res.json()
    assert data["id"] == routine_id
    assert "poses" in data
    assert len(data["poses"]) > 0


def test_export_nonexistent_routine(client):
    res = client.get("/api/v1/routines/non-existent-id/export?format=pdf")
    assert res.status_code == 404
