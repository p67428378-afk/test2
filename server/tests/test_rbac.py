def test_rbac_roles_matrix(client, investigator_headers):
    res = client.get("/api/v1/rbac/roles", headers=investigator_headers)
    assert res.status_code == 200
    matrix = res.json()
    assert "Administrator" in matrix["roles"]
    assert "Investigator" in matrix["roles"]
    assert len(matrix["capabilities"]) == 6


def test_admin_user_role_management(client, admin_headers):
    # List users
    users_res = client.get("/api/v1/rbac/users", headers=admin_headers)
    assert users_res.status_code == 200
    users = users_res.json()
    target_user = next(u for u in users if u["email"] == "charlie@police.gov")

    # Update Charlie's role to Investigator
    update_res = client.put(
        f"/api/v1/rbac/users/{target_user['id']}/role",
        json={"role": "Investigator"},
        headers=admin_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["role"] == "Investigator"


def test_investigator_cannot_manage_roles(client, investigator_headers):
    res = client.get("/api/v1/rbac/users", headers=investigator_headers)
    assert res.status_code == 403


def test_rbac_403_creates_audit_log_entry(client, observer_headers, admin_headers):
    # Observer tries to create a case (forbidden)
    forbidden_res = client.post(
        "/api/v1/cases",
        json={"case_number": "CASE-FORBIDDEN", "title": "Unauthorized Case"},
        headers=observer_headers,
    )
    assert forbidden_res.status_code == 403

    # Admin checks audit logs for the 403 event
    logs_res = client.get("/api/v1/audit-logs?status_code=403", headers=admin_headers)
    assert logs_res.status_code == 200
    logs = logs_res.json()
    assert any(log["action"] == "ACCESS_DENIED_403" for log in logs["items"])
