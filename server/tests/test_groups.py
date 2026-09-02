def test_create_group(client):
    response = client.post(
        "/api/v1/groups",
        json={"name": "Road Trip 2026", "description": "Trip with friends to the coast"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Road Trip 2026"
    assert data["description"] == "Trip with friends to the coast"
    assert "id" in data
    assert "created_at" in data


def test_list_groups(client):
    client.post("/api/v1/groups", json={"name": "Group 1"})
    client.post("/api/v1/groups", json={"name": "Group 2"})

    response = client.get("/api/v1/groups")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_get_group_details(client):
    create_res = client.post("/api/v1/groups", json={"name": "Camping Trip"})
    group_id = create_res.json()["id"]

    # Add members
    client.post(
        f"/api/v1/groups/{group_id}/members",
        json={"name": "Alice", "email": "alice@example.com"},
    )
    client.post(
        f"/api/v1/groups/{group_id}/members",
        json={"name": "Bob", "email": "bob@example.com"},
    )

    response = client.get(f"/api/v1/groups/{group_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == group_id
    assert len(data["members"]) == 2
    names = {m["name"] for m in data["members"]}
    assert "Alice" in names
    assert "Bob" in names


def test_get_group_not_found(client):
    response = client.get("/api/v1/groups/non-existent-uuid")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_add_member_to_non_existent_group(client):
    response = client.post(
        "/api/v1/groups/non-existent-uuid/members",
        json={"name": "Ghost"},
    )
    assert response.status_code == 404
