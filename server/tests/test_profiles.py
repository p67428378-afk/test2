from fastapi.testclient import TestClient


def test_get_current_user_profile(client: TestClient):
    response = client.get(
        "/api/v1/profiles/me", headers={"X-User-Email": "test@example.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert len(data["teach_skills"]) >= 1
    assert len(data["learn_skills"]) >= 2
    assert any(s["skill_name"] == "Python Programming" for s in data["teach_skills"])
    assert any(s["skill_name"] == "React Framework" for s in data["learn_skills"])


def test_add_user_skill_success(client: TestClient):
    payload = {
        "skill_name": "Docker Containerization",
        "type": "TEACH",
        "proficiency": "INTERMEDIATE",
        "category": "DevOps",
        "description": "Building Docker images",
    }
    response = client.post(
        "/api/v1/profiles/skills",
        json=payload,
        headers={"X-User-Email": "test@example.com"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["skill_name"] == "Docker Containerization"
    assert data["type"] == "TEACH"
    assert data["proficiency"] == "INTERMEDIATE"


def test_add_duplicate_skill(client: TestClient):
    payload = {
        "skill_name": "Python Programming",
        "type": "TEACH",
        "proficiency": "BEGINNER",
    }
    response = client.post(
        "/api/v1/profiles/skills",
        json=payload,
        headers={"X-User-Email": "test@example.com"},
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_add_skill_empty_name(client: TestClient):
    payload = {"skill_name": "  ", "type": "TEACH", "proficiency": "BEGINNER"}
    response = client.post(
        "/api/v1/profiles/skills",
        json=payload,
        headers={"X-User-Email": "test@example.com"},
    )
    assert response.status_code == 400


def test_delete_user_skill(client: TestClient):
    # First add a temporary skill
    add_res = client.post(
        "/api/v1/profiles/skills",
        json={"skill_name": "GraphQL API", "type": "TEACH", "proficiency": "BEGINNER"},
        headers={"X-User-Email": "test@example.com"},
    )
    assert add_res.status_code == 201
    skill_id = add_res.json()["id"]

    # Delete it
    del_res = client.delete(
        f"/api/v1/profiles/skills/{skill_id}",
        headers={"X-User-Email": "test@example.com"},
    )
    assert del_res.status_code == 204
