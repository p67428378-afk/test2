from datetime import datetime, timedelta


def test_create_task_success(client):
    due_date = (datetime.utcnow() + timedelta(days=7)).isoformat() + "Z"
    payload = {
        "title": "Transformer Inspection at Substation A",
        "description": "Perform annual thermal imaging and oil sampling.",
        "location_equipment": "Substation A - Unit T2",
        "priority": "High",
        "estimated_cost": 500.0,
        "due_date": due_date,
    }
    response = client.post("/api/v1/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["location_equipment"] == payload["location_equipment"]
    assert data["priority"] == "High"
    assert data["status"] == "Pending"
    assert data["estimated_cost"] == 500.0
    assert "id" in data


def test_create_task_missing_title(client):
    due_date = (datetime.utcnow() + timedelta(days=7)).isoformat() + "Z"
    payload = {
        "title": "",
        "location_equipment": "Substation A",
        "priority": "Low",
        "estimated_cost": 100.0,
        "due_date": due_date,
    }
    response = client.post("/api/v1/tasks", json=payload)
    assert response.status_code == 422


def test_create_task_negative_cost(client):
    due_date = (datetime.utcnow() + timedelta(days=7)).isoformat() + "Z"
    payload = {
        "title": "Generator Maintenance",
        "location_equipment": "Generator Room 1",
        "priority": "Medium",
        "estimated_cost": -50.0,
        "due_date": due_date,
    }
    response = client.post("/api/v1/tasks", json=payload)
    assert response.status_code == 422


def test_get_tasks_and_filter(client):
    # Retrieve list
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


def test_get_task_by_id(client):
    due_date = (datetime.utcnow() + timedelta(days=3)).isoformat() + "Z"
    payload = {
        "title": "Feeder Line Repair",
        "location_equipment": "Feeder #4",
        "priority": "Urgent",
        "estimated_cost": 1200.0,
        "due_date": due_date,
    }
    create_res = client.post("/api/v1/tasks", json=payload)
    task_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/tasks/{task_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == task_id


def test_update_task(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    payload = {
        "title": "Breaker Testing",
        "location_equipment": "Main Control Room",
        "priority": "Low",
        "estimated_cost": 250.0,
        "due_date": due_date,
    }
    create_res = client.post("/api/v1/tasks", json=payload)
    task_id = create_res.json()["id"]

    update_payload = {"title": "Updated Breaker Testing", "priority": "High"}
    update_res = client.put(f"/api/v1/tasks/{task_id}", json=update_payload)
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Breaker Testing"
    assert update_res.json()["priority"] == "High"


def test_assign_task(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    payload = {
        "title": "Meter Replacement",
        "location_equipment": "Grid Station B",
        "priority": "Medium",
        "estimated_cost": 150.0,
        "due_date": due_date,
    }
    task_id = client.post("/api/v1/tasks", json=payload).json()["id"]

    # Get technician
    tech_res = client.get("/api/v1/technicians")
    assert tech_res.status_code == 200
    techs = tech_res.json()
    assert len(techs) > 0
    tech_id = techs[0]["id"]

    assign_res = client.put(
        f"/api/v1/tasks/{task_id}/assign", json={"assigned_to_id": tech_id}
    )
    assert assign_res.status_code == 200
    assert assign_res.json()["assigned_to_id"] == tech_id


def test_assign_task_invalid_technician(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    payload = {
        "title": "Relay Calibration",
        "location_equipment": "Substation C",
        "priority": "High",
        "estimated_cost": 300.0,
        "due_date": due_date,
    }
    task_id = client.post("/api/v1/tasks", json=payload).json()["id"]

    assign_res = client.put(
        f"/api/v1/tasks/{task_id}/assign",
        json={"assigned_to_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert assign_res.status_code == 400


def test_complete_task_success(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    payload = {
        "title": "Capacitor Bank Service",
        "location_equipment": "Capacitor Yard",
        "priority": "High",
        "estimated_cost": 800.0,
        "due_date": due_date,
    }
    task_id = client.post("/api/v1/tasks", json=payload).json()["id"]

    complete_payload = {
        "actual_cost": 750.0,
        "resolution_notes": "Replaced blown fuses and recalibrated power factor controller.",
    }
    complete_res = client.put(
        f"/api/v1/tasks/{task_id}/complete", json=complete_payload
    )
    assert complete_res.status_code == 200
    data = complete_res.json()
    assert data["status"] == "Completed"
    assert data["actual_cost"] == 750.0
    assert data["resolution_notes"] == complete_payload["resolution_notes"]
    assert data["completed_at"] is not None


def test_complete_task_missing_notes(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    payload = {
        "title": "Switchgear Cleaning",
        "location_equipment": "Switchyard A",
        "priority": "Low",
        "estimated_cost": 200.0,
        "due_date": due_date,
    }
    task_id = client.post("/api/v1/tasks", json=payload).json()["id"]

    complete_payload = {"actual_cost": 200.0, "resolution_notes": ""}
    complete_res = client.put(
        f"/api/v1/tasks/{task_id}/complete", json=complete_payload
    )
    assert complete_res.status_code == 422


def test_delete_task(client):
    due_date = (datetime.utcnow() + timedelta(days=5)).isoformat() + "Z"
    payload = {
        "title": "Temporary Task",
        "location_equipment": "Site X",
        "priority": "Low",
        "estimated_cost": 50.0,
        "due_date": due_date,
    }
    task_id = client.post("/api/v1/tasks", json=payload).json()["id"]

    delete_res = client.delete(f"/api/v1/tasks/{task_id}")
    assert delete_res.status_code == 204

    get_res = client.get(f"/api/v1/tasks/{task_id}")
    assert get_res.status_code == 404
