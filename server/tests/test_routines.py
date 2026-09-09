def test_list_routines(client):
    response = client.get("/api/v1/routines")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_create_routine_success(client):
    poses_res = client.get("/api/v1/poses")
    poses = poses_res.json()
    assert len(poses) >= 2

    p1_id = poses[0]["id"]
    p2_id = poses[1]["id"]

    payload = {
        "name": "Evening Relaxation Flow",
        "description": "Gentle poses to wind down before sleep.",
        "poses": [
            {
                "pose_id": p1_id,
                "sequence_order": 1,
                "hold_duration_seconds": 60,
                "transition_notes": "Slowly lower down to the mat.",
            },
            {
                "pose_id": p2_id,
                "sequence_order": 2,
                "hold_duration_seconds": 90,
                "transition_notes": "Deep breath in, sink into stillness.",
            },
        ],
    }

    res = client.post("/api/v1/routines", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Evening Relaxation Flow"
    assert data["total_duration_seconds"] == 150
    assert len(data["poses"]) == 2
    assert data["poses"][0]["pose_id"] == p1_id


def test_create_empty_routine_fails(client):
    payload = {
        "name": "Empty Routine",
        "description": "No poses included.",
        "poses": [],
    }
    res = client.post("/api/v1/routines", json=payload)
    assert res.status_code == 400
    assert "empty routines cannot be saved" in res.json()["detail"].lower()


def test_get_routine_by_id(client):
    list_res = client.get("/api/v1/routines")
    routines = list_res.json()
    assert len(routines) > 0
    routine_id = routines[0]["id"]

    res = client.get(f"/api/v1/routines/{routine_id}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == routine_id
    assert "poses" in data


def test_update_routine(client):
    # Create routine first
    poses_res = client.get("/api/v1/poses")
    poses = poses_res.json()
    p1_id = poses[0]["id"]

    create_res = client.post(
        "/api/v1/routines",
        json={
            "name": "Original Routine",
            "description": "Desc",
            "poses": [
                {"pose_id": p1_id, "sequence_order": 1, "hold_duration_seconds": 30}
            ],
        },
    )
    routine_id = create_res.json()["id"]

    # Update routine
    update_res = client.put(
        f"/api/v1/routines/{routine_id}",
        json={
            "name": "Updated Routine Title",
            "description": "Updated Description",
            "poses": [
                {
                    "pose_id": p1_id,
                    "sequence_order": 1,
                    "hold_duration_seconds": 45,
                    "transition_notes": "Stay strong",
                }
            ],
        },
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["name"] == "Updated Routine Title"
    assert updated["total_duration_seconds"] == 45
    assert updated["poses"][0]["hold_duration_seconds"] == 45


def test_duplicate_routine(client):
    list_res = client.get("/api/v1/routines")
    routine_id = list_res.json()[0]["id"]

    dup_res = client.post(f"/api/v1/routines/{routine_id}/duplicate")
    assert dup_res.status_code == 201
    dup_data = dup_res.json()
    assert "(Copy)" in dup_data["name"]
    assert dup_data["id"] != routine_id


def test_delete_routine(client):
    poses_res = client.get("/api/v1/poses")
    p1_id = poses_res.json()[0]["id"]

    create_res = client.post(
        "/api/v1/routines",
        json={
            "name": "To Delete Routine",
            "poses": [{"pose_id": p1_id, "hold_duration_seconds": 20}],
        },
    )
    routine_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/routines/{routine_id}")
    assert del_res.status_code == 200

    # Verify 404 on fetch
    get_res = client.get(f"/api/v1/routines/{routine_id}")
    assert get_res.status_code == 404
