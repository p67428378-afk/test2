"""Unit and integration tests for v2 Extended Features endpoints."""


def test_list_features(client):
    response = client.get("/api/v1/features")
    assert response.status_code == 200
    features = response.json()
    assert len(features) >= 1
    sync_feat = next(
        (f for f in features if "Live Gallery Sync" in f["feature_name"]), None
    )
    assert sync_feat is not None
    assert sync_feat["status"] == "Active"


def test_create_feature_success(client):
    payload = {
        "feature_name": "AI Portrait Auto-Retouching",
        "configuration": '{"skin_smoothing": true, "color_grading": "cinematic"}',
        "status": "Active",
    }
    response = client.post("/api/v1/features", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["feature_name"] == "AI Portrait Auto-Retouching"
    assert data["status"] == "Active"
    assert "id" in data


def test_create_feature_duplicate_conflict(client):
    payload = {
        "feature_name": "Duplicate Feature Test",
        "configuration": "{}",
        "status": "Active",
    }
    res1 = client.post("/api/v1/features", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/features", json=payload)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"]


def test_create_feature_validation_error(client):
    # Missing required feature_name
    payload = {
        "configuration": "{}",
    }
    response = client.post("/api/v1/features", json=payload)
    assert response.status_code == 422


def test_get_feature_by_id_and_not_found(client):
    features = client.get("/api/v1/features").json()
    feat_id = features[0]["id"]

    res = client.get(f"/api/v1/features/{feat_id}")
    assert res.status_code == 200
    assert res.json()["id"] == feat_id

    res_404 = client.get("/api/v1/features/non-existent-uuid")
    assert res_404.status_code == 404


def test_update_and_delete_feature(client):
    # 1. Create
    create_res = client.post(
        "/api/v1/features",
        json={"feature_name": "Feature To Update", "status": "Pending"},
    )
    feat_id = create_res.json()["id"]

    # 2. Update
    upd_res = client.put(
        f"/api/v1/features/{feat_id}",
        json={"feature_name": "Feature Updated", "status": "Active"},
    )
    assert upd_res.status_code == 200
    assert upd_res.json()["feature_name"] == "Feature Updated"
    assert upd_res.json()["status"] == "Active"

    # 3. Delete
    del_res = client.delete(f"/api/v1/features/{feat_id}")
    assert del_res.status_code == 200

    # 4. Confirm deleted
    res_404 = client.get(f"/api/v1/features/{feat_id}")
    assert res_404.status_code == 404
