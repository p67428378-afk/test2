def test_list_poses(client):
    response = client.get("/api/v1/poses")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5


def test_search_poses_english(client):
    response = client.get("/api/v1/poses?query=Warrior")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any("Warrior" in p["english_name"] for p in data)


def test_search_poses_sanskrit(client):
    response = client.get("/api/v1/poses?query=Adho Mukha")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert "Downward-Facing Dog" in data[0]["english_name"]


def test_filter_poses_difficulty_and_category(client):
    response = client.get("/api/v1/poses?difficulty=Beginner&category=Standing")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for p in data:
        assert p["difficulty"].lower() == "beginner"
        assert p["category"].lower() == "standing"


def test_get_pose_by_id(client):
    # First get list of poses
    list_res = client.get("/api/v1/poses")
    assert list_res.status_code == 200
    poses = list_res.json()
    assert len(poses) > 0
    pose_id = poses[0]["id"]

    # Fetch detail
    detail_res = client.get(f"/api/v1/poses/{pose_id}")
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["id"] == pose_id
    assert "alignment_cues" in data
    assert "target_muscles" in data


def test_get_nonexistent_pose(client):
    response = client.get("/api/v1/poses/non-existent-uuid-12345")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_create_pose(client):
    payload = {
        "english_name": "Plank Pose",
        "sanskrit_name": "Phalakasana",
        "difficulty": "Beginner",
        "category": "Balance",
        "alignment_cues": "Shoulders stacked over wrists, firm abdominal wall, straight line from crown to heels.",
        "breath_instructions": "Steady even breath, do not hold breath.",
        "target_muscles": "Core, shoulders, wrists, calves",
        "common_mistakes": "Sagging hips, hiking hips too high.",
        "image_url": "https://example.com/plank.jpg",
        "video_url": "",
    }
    response = client.post("/api/v1/poses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["english_name"] == "Plank Pose"
    assert data["id"] is not None


def test_favorites_workflow(client):
    # Get a pose ID
    list_res = client.get("/api/v1/poses")
    poses = list_res.json()
    pose_id = poses[0]["id"]

    # Bookmark pose
    fav_res = client.post(f"/api/v1/poses/{pose_id}/favorite?user_id=test_user_fav")
    assert fav_res.status_code == 201
    assert fav_res.json()["pose_id"] == pose_id

    # List favorites
    get_favs = client.get("/api/v1/poses/favorites?user_id=test_user_fav")
    assert get_favs.status_code == 200
    fav_list = get_favs.json()
    assert len(fav_list) == 1
    assert fav_list[0]["id"] == pose_id
    assert fav_list[0]["is_favorite"] is True

    # Check that pose list reflects is_favorite=True for this user
    list_with_user = client.get("/api/v1/poses?user_id=test_user_fav")
    p_match = next(p for p in list_with_user.json() if p["id"] == pose_id)
    assert p_match["is_favorite"] is True

    # Delete favorite
    del_fav = client.delete(f"/api/v1/poses/{pose_id}/favorite?user_id=test_user_fav")
    assert del_fav.status_code == 200

    # Verify favorites is empty now
    get_favs_after = client.get("/api/v1/poses/favorites?user_id=test_user_fav")
    assert len(get_favs_after.json()) == 0
