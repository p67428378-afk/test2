def test_list_poses_returns_seeded_catalog(client):
    response = client.get("/api/v1/poses")
    assert response.status_code == 200
    poses = response.json()
    assert len(poses) >= 5
    names = [p["english_name"] for p in poses]
    assert "Downward-Facing Dog" in names
    assert "Warrior I" in names


def test_search_poses_english_and_sanskrit(client):
    # Search English
    res_en = client.get("/api/v1/poses?query=Warrior")
    assert res_en.status_code == 200
    poses_en = res_en.json()
    assert len(poses_en) >= 3
    for p in poses_en:
        assert "Warrior" in p["english_name"] or "Warrior" in p["sanskrit_name"]

    # Search Sanskrit
    res_sa = client.get("/api/v1/poses?query=Adho Mukha")
    assert res_sa.status_code == 200
    poses_sa = res_sa.json()
    assert len(poses_sa) == 1
    assert poses_sa[0]["english_name"] == "Downward-Facing Dog"


def test_filter_poses_by_category_and_difficulty(client):
    # Category filter
    res_cat = client.get("/api/v1/poses?category=Balance")
    assert res_cat.status_code == 200
    poses_cat = res_cat.json()
    for p in poses_cat:
        assert p["category"].lower() == "balance"

    # Difficulty filter
    res_diff = client.get("/api/v1/poses?difficulty=Advanced")
    assert res_diff.status_code == 200
    poses_diff = res_diff.json()
    for p in poses_diff:
        assert p["difficulty"].lower() == "advanced"

    # Combined filter
    res_comb = client.get("/api/v1/poses?category=Balance&difficulty=Beginner")
    assert res_comb.status_code == 200
    poses_comb = res_comb.json()
    for p in poses_comb:
        assert p["category"].lower() == "balance"
        assert p["difficulty"].lower() == "beginner"


def test_search_non_existent_pose_returns_empty_list(client):
    res = client.get("/api/v1/poses?query=UnknownPosture999")
    assert res.status_code == 200
    assert res.json() == []


def test_get_pose_detail_success(client):
    pose_id = "3fa85f64-5717-4562-b3fc-2c963f66afa1"
    response = client.get(f"/api/v1/poses/{pose_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["english_name"] == "Downward-Facing Dog"
    assert data["sanskrit_name"] == "Adho Mukha Svanasana"
    assert len(data["alignment_cues"]) >= 1
    assert "Hamstrings" in data["target_muscles"]
    assert data["breath_instructions"] is not None


def test_get_pose_detail_not_found(client):
    response = client.get("/api/v1/poses/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert response.json()["detail"] == "Pose not found"


def test_create_pose_success(client):
    payload = {
        "english_name": "Triangle Pose",
        "sanskrit_name": "Trikonasana",
        "difficulty": "Beginner",
        "category": "Standing",
        "alignment_cues": [
            "Step feet wide and turn front foot 90 degrees.",
            "Reach forward and lower front hand to shin or block.",
            "Extend top arm straight up toward ceiling.",
        ],
        "breath_instructions": "Inhale to open heart, exhale to stabilize foundation.",
        "target_muscles": ["Hamstrings", "Groin", "Hips", "Spine"],
        "common_mistakes": ["Collapsing chest forward toward floor."],
        "image_url": "https://images.unsplash.com/photo-triangle",
        "video_url": None,
    }
    response = client.post("/api/v1/poses", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["id"] is not None
    assert created["english_name"] == "Triangle Pose"
    assert len(created["alignment_cues"]) == 3


def test_update_pose_success(client):
    pose_id = "3fa85f64-5717-4562-b3fc-2c963f66afa2"
    update_payload = {
        "breath_instructions": "Updated breath instructions for Warrior I."
    }
    response = client.put(f"/api/v1/poses/{pose_id}", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert (
        updated["breath_instructions"] == "Updated breath instructions for Warrior I."
    )
