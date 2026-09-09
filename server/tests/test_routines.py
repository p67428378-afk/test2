def test_list_routines_returns_seeded_flow(client):
    response = client.get("/api/v1/routines")
    assert response.status_code == 200
    routines = response.json()
    assert len(routines) >= 1
    assert routines[0]["name"] == "Morning Energizer Flow"
    assert routines[0]["total_duration_seconds"] == 150
    assert len(routines[0]["items"]) == 3


def test_create_routine_success_and_duration_calculation(client):
    payload = {
        "name": "Evening Unwind Flow",
        "description": "Gentle restorative sequence before sleep.",
        "items": [
            {
                "pose_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",  # Child's Pose
                "sequence_order": 1,
                "hold_duration_seconds": 60,
                "transition_notes": "Settle onto heels",
            },
            {
                "pose_id": "3fa85f64-5717-4562-b3fc-2c963f66afb0",  # Seated Forward Bend
                "sequence_order": 2,
                "hold_duration_seconds": 90,
                "transition_notes": "Slowly extend legs forward",
            },
        ],
    }
    response = client.post("/api/v1/routines", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["id"] is not None
    assert created["name"] == "Evening Unwind Flow"
    assert created["total_duration_seconds"] == 150
    assert len(created["items"]) == 2
    assert created["items"][0]["pose"]["english_name"] == "Child's Pose"


def test_create_routine_allows_duplicate_poses_in_sequence(client):
    payload = {
        "name": "Warrior Flow Repetitions",
        "description": "Flow with repeated Warrior poses for both sides.",
        "items": [
            {
                "pose_id": "3fa85f64-5717-4562-b3fc-2c963f66afa2",  # Warrior I Right
                "sequence_order": 1,
                "hold_duration_seconds": 45,
                "transition_notes": "Right side lunge",
            },
            {
                "pose_id": "3fa85f64-5717-4562-b3fc-2c963f66afa2",  # Warrior I Left (duplicate)
                "sequence_order": 2,
                "hold_duration_seconds": 45,
                "transition_notes": "Step back and switch to Left side",
            },
        ],
    }
    response = client.post("/api/v1/routines", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert len(created["items"]) == 2
    assert created["total_duration_seconds"] == 90


def test_create_routine_with_empty_items_fails(client):
    payload = {
        "name": "Empty Routine",
        "description": "Invalid empty routine",
        "items": [],
    }
    response = client.post("/api/v1/routines", json=payload)
    assert response.status_code == 422 or response.status_code == 400


def test_create_routine_with_invalid_pose_id_fails(client):
    payload = {
        "name": "Invalid Pose Routine",
        "description": "Has non-existent pose",
        "items": [
            {
                "pose_id": "00000000-0000-0000-0000-000000000000",
                "sequence_order": 1,
                "hold_duration_seconds": 30,
                "transition_notes": "Invalid",
            }
        ],
    }
    response = client.post("/api/v1/routines", json=payload)
    assert response.status_code == 400
    assert "does not exist" in response.json()["detail"]


def test_get_routine_by_id_success(client):
    routine_id = "4fa85f64-5717-4562-b3fc-2c963f66b001"
    response = client.get(f"/api/v1/routines/{routine_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Morning Energizer Flow"
    assert len(data["items"]) == 3
    # Check sequence order
    orders = [item["sequence_order"] for item in data["items"]]
    assert orders == sorted(orders)


def test_get_routine_not_found(client):
    response = client.get("/api/v1/routines/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert response.json()["detail"] == "Routine not found"


def test_update_routine_metadata_and_items(client):
    routine_id = "4fa85f64-5717-4562-b3fc-2c963f66b001"
    update_payload = {
        "name": "Morning Energizer Flow - Modified",
        "items": [
            {
                "pose_id": "3fa85f64-5717-4562-b3fc-2c963f66afa5",  # Tree Pose
                "sequence_order": 1,
                "hold_duration_seconds": 40,
                "transition_notes": "Root right foot",
            }
        ],
    }
    response = client.put(f"/api/v1/routines/{routine_id}", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert updated["name"] == "Morning Energizer Flow - Modified"
    assert updated["total_duration_seconds"] == 40
    assert len(updated["items"]) == 1


def test_duplicate_routine_success(client):
    routine_id = "4fa85f64-5717-4562-b3fc-2c963f66b001"
    response = client.post(f"/api/v1/routines/{routine_id}/duplicate")
    assert response.status_code == 201
    copy_data = response.json()
    assert copy_data["id"] != routine_id
    assert copy_data["name"] == "Morning Energizer Flow (Copy)"
    assert copy_data["total_duration_seconds"] == 150
    assert len(copy_data["items"]) == 3


def test_duplicate_routine_not_found(client):
    response = client.post(
        "/api/v1/routines/00000000-0000-0000-0000-000000000000/duplicate"
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Routine not found"


def test_delete_routine_success(client):
    # First create a routine to delete
    payload = {
        "name": "Temporary Flow",
        "description": "To be deleted",
        "items": [
            {
                "pose_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "sequence_order": 1,
                "hold_duration_seconds": 30,
                "transition_notes": "None",
            }
        ],
    }
    create_res = client.post("/api/v1/routines", json=payload)
    assert create_res.status_code == 201
    temp_id = create_res.json()["id"]

    # Delete routine
    del_res = client.delete(f"/api/v1/routines/{temp_id}")
    assert del_res.status_code == 204

    # Verify 404 on get
    get_res = client.get(f"/api/v1/routines/{temp_id}")
    assert get_res.status_code == 404
