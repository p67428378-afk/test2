import uuid
from fastapi.testclient import TestClient


def test_list_projects_success(client: TestClient):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

    first = data[0]
    assert "id" in first
    assert "title" in first
    assert "summary" in first
    assert "tags" in first
    assert isinstance(first["tags"], list)
    assert "created_at" in first


def test_list_projects_tag_filter(client: TestClient):
    response = client.get("/api/v1/projects?tag=React")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for proj in data:
        assert any("react" in t.lower() for t in proj["tags"])


def test_list_projects_tag_not_found(client: TestClient):
    response = client.get("/api/v1/projects?tag=NonExistentTechnologyTag12345")
    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_list_projects_pagination(client: TestClient):
    response_all = client.get("/api/v1/projects?limit=10")
    assert response_all.status_code == 200
    all_data = response_all.json()

    if len(all_data) > 1:
        response_paginated = client.get("/api/v1/projects?skip=1&limit=1")
        assert response_paginated.status_code == 200
        paginated_data = response_paginated.json()
        assert len(paginated_data) == 1
        assert paginated_data[0]["id"] == all_data[1]["id"]


def test_get_project_detail_success(client: TestClient):
    list_res = client.get("/api/v1/projects")
    assert list_res.status_code == 200
    projects = list_res.json()
    assert len(projects) > 0
    target_id = projects[0]["id"]

    detail_res = client.get(f"/api/v1/projects/{target_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == target_id
    assert detail["title"] == projects[0]["title"]
    assert "full_description" in detail
    assert "gallery_images" in detail
    assert "client_context" in detail
    assert "tags" in detail
    assert isinstance(detail["tags"], list)


def test_get_project_detail_not_found(client: TestClient):
    non_existent_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/projects/{non_existent_id}")
    assert response.status_code == 404
    error_data = response.json()
    assert "detail" in error_data
    assert f"Project with ID {non_existent_id} not found" in error_data["detail"]
