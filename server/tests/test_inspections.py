from datetime import datetime, timedelta


def test_inspection_lifecycle(client):
    hives_resp = client.get("/api/v1/hives")
    hive_id = hives_resp.json()[0]["id"]

    scheduled_dt = (datetime.utcnow() + timedelta(days=2)).isoformat()

    payload = {
        "hive_id": hive_id,
        "scheduled_date": scheduled_dt,
        "inspector_name": "Jane Inspector",
        "notes": "Check queen laying pattern and honey super storage.",
    }

    create_resp = client.post("/api/v1/inspections", json=payload)
    assert create_resp.status_code == 201
    insp = create_resp.json()
    assert insp["status"] == "scheduled"
    insp_id = insp["id"]

    # Update inspection to completed
    completed_dt = datetime.utcnow().isoformat()
    patch_resp = client.patch(
        f"/api/v1/inspections/{insp_id}",
        json={
            "status": "completed",
            "completed_at": completed_dt,
            "notes": "Queen healthy, frame 4 full of brood.",
        },
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "completed"

    # List completed inspections
    list_resp = client.get("/api/v1/inspections?status_filter=completed")
    assert list_resp.status_code == 200
    completed_list = list_resp.json()
    assert any(i["id"] == insp_id for i in completed_list)
