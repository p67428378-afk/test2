"""Unit and integration tests for Task Comments endpoints."""

import uuid


def test_comment_lifecycle(client, user_headers, admin_headers):
    """Test creating, listing, updating, and deleting comments on a task."""
    # Create project and task
    proj = client.post(
        "/api/v1/projects",
        json={"name": "Comment Proj"},
        headers=user_headers,
    ).json()

    task = client.post(
        "/api/v1/tasks",
        json={"project_id": proj["id"], "summary": "Task with comments"},
        headers=user_headers,
    ).json()

    # Post comment
    c_res = client.post(
        f"/api/v1/tasks/{task['id']}/comments",
        json={"body": "Initial comment on task"},
        headers=user_headers,
    )
    assert c_res.status_code == 201
    comment = c_res.json()
    assert comment["body"] == "Initial comment on task"
    c_id = comment["id"]

    # List comments
    list_res = client.get(
        f"/api/v1/tasks/{task['id']}/comments",
        headers=user_headers,
    )
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Update comment as author
    update_res = client.patch(
        f"/api/v1/comments/{c_id}",
        json={"body": "Updated comment text"},
        headers=user_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["body"] == "Updated comment text"

    # Admin can also delete
    del_res = client.delete(f"/api/v1/comments/{c_id}", headers=admin_headers)
    assert del_res.status_code == 204

    # Verify not found
    get_res = client.get(f"/api/v1/comments/{c_id}", headers=user_headers)
    assert get_res.status_code == 404


def test_comment_nonexistent_task(client, user_headers):
    """Test adding a comment to a non-existent task returns 404."""
    fake_id = str(uuid.uuid4())
    res = client.post(
        f"/api/v1/tasks/{fake_id}/comments",
        json={"body": "Orphan comment"},
        headers=user_headers,
    )
    assert res.status_code == 404
