"""Unit and integration tests for Projects endpoints."""

import uuid


def test_create_and_get_project(client, user_headers):
    """Test creating a project and fetching it by ID."""
    proj_name = f"Project_{uuid.uuid4().hex[:6]}"
    create_res = client.post(
        "/api/v1/projects",
        json={
            "name": proj_name,
            "description": "Testing description",
            "status": "Planning",
        },
        headers=user_headers,
    )
    assert create_res.status_code == 201
    proj_data = create_res.json()
    proj_id = proj_data["id"]
    assert proj_data["name"] == proj_name
    assert proj_data["status"] == "Planning"

    # Fetch by ID
    get_res = client.get(f"/api/v1/projects/{proj_id}", headers=user_headers)
    assert get_res.status_code == 200
    assert get_res.json()["name"] == proj_name


def test_list_projects_with_filter(client, user_headers):
    """Test listing projects with status filter and pagination."""
    res = client.get(
        "/api/v1/projects?status=In Progress&skip=0&limit=10", headers=user_headers
    )
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_update_project(client, user_headers):
    """Test updating a project's status and name."""
    create_res = client.post(
        "/api/v1/projects",
        json={"name": "Old Name", "status": "Planning"},
        headers=user_headers,
    )
    assert create_res.status_code == 201
    proj_id = create_res.json()["id"]

    patch_res = client.patch(
        f"/api/v1/projects/{proj_id}",
        json={"name": "New Name", "status": "In Progress"},
        headers=user_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["name"] == "New Name"
    assert patch_res.json()["status"] == "In Progress"


def test_delete_project(client, admin_headers, user_headers):
    """Test deleting a project as owner or admin."""
    create_res = client.post(
        "/api/v1/projects",
        json={"name": "To Delete", "status": "Planning"},
        headers=user_headers,
    )
    assert create_res.status_code == 201
    proj_id = create_res.json()["id"]

    # Delete as owner
    del_res = client.delete(f"/api/v1/projects/{proj_id}", headers=user_headers)
    assert del_res.status_code == 204

    # Verify not found
    get_res = client.get(f"/api/v1/projects/{proj_id}", headers=user_headers)
    assert get_res.status_code == 404


def test_get_nonexistent_project(client, user_headers):
    """Test fetching non-existent project returns 404."""
    fake_id = str(uuid.uuid4())
    res = client.get(f"/api/v1/projects/{fake_id}", headers=user_headers)
    assert res.status_code == 404
