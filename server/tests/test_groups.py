# Test cases for Group Management


def test_create_group_success(client):
    # AC: Users can create group specifying name, description, and participating members
    payload = {
        "name": "Trip to NYC",
        "description": "Weekend getaway in New York",
        "members": [
            {"name": "Alice", "email": "alice@example.com"},
            {"name": "Bob", "email": "bob@example.com"},
            {"name": "Charlie", "email": "charlie@example.com"},
        ],
    }
    response = client.post("/api/v1/groups", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Trip to NYC"
    assert data["description"] == "Weekend getaway in New York"
    assert len(data["members"]) == 3
    member_names = [m["name"] for m in data["members"]]
    assert "Alice" in member_names
    assert "Bob" in member_names
    assert "Charlie" in member_names


def test_create_group_empty_name_fails(client):
    # AC: Input validation blocks invalid inputs like empty names
    payload = {
        "name": "",
        "members": [{"name": "Alice"}],
    }
    response = client.post("/api/v1/groups", json=payload)
    assert response.status_code in [400, 422]


def test_create_group_empty_members_fails(client):
    # AC: Input validation blocks empty member lists
    payload = {
        "name": "Solo Group",
        "members": [],
    }
    response = client.post("/api/v1/groups", json=payload)
    assert response.status_code in [400, 422]


def test_create_group_duplicate_member_names_fails(client):
    # AC: Group members must be uniquely identifiable within the group
    payload = {
        "name": "Duplicate Members Group",
        "members": [
            {"name": "Alice"},
            {"name": "alice"},
        ],
    }
    response = client.post("/api/v1/groups", json=payload)
    assert response.status_code == 400
    assert "unique" in response.json()["detail"].lower()


def test_list_groups(client):
    # AC: Users can view groups overview with member counts and total spent
    payload = {
        "name": "Ski Trip",
        "members": [{"name": "Dave"}, {"name": "Eve"}],
    }
    client.post("/api/v1/groups", json=payload)

    response = client.get("/api/v1/groups")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    group_entry = next(g for g in data if g["name"] == "Ski Trip")
    assert group_entry["member_count"] == 2
    assert group_entry["total_spent"] == 0.0


def test_get_group_by_id(client):
    # AC: Retrieve group details with member IDs
    create_res = client.post(
        "/api/v1/groups",
        json={"name": "Road Trip", "members": [{"name": "Frank"}]},
    )
    group_id = create_res.json()["id"]

    response = client.get(f"/api/v1/groups/{group_id}")
    assert response.status_code == 200
    assert response.json()["id"] == group_id
    assert response.json()["name"] == "Road Trip"


def test_get_nonexistent_group_returns_404(client):
    response = client.get("/api/v1/groups/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
