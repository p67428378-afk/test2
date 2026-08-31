def test_create_guide(client):
    # AC3: Administrators can manage guide profiles
    payload = {
        "name": "Dr. Sarah Connor",
        "email": "sarah.connor@museum.org",
        "specialization": "Sculpture & Renaissance",
    }
    response = client.post("/api/v1/guides", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_create_guide_duplicate_email(client):
    # AC3: Prevent duplicate guide email
    payload = {
        "name": "Dr. Sarah Connor",
        "email": "sarah.connor@museum.org",
        "specialization": "Sculpture",
    }
    client.post("/api/v1/guides", json=payload)
    dup_res = client.post("/api/v1/guides", json=payload)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]


def test_list_guides(client):
    # AC3: View guide list
    client.post(
        "/api/v1/guides",
        json={"name": "Alice", "email": "alice@museum.org", "specialization": "Art"},
    )
    client.post(
        "/api/v1/guides",
        json={"name": "Bob", "email": "bob@museum.org", "specialization": "History"},
    )

    response = client.get("/api/v1/guides")
    assert response.status_code == 200
    guides = response.json()
    assert len(guides) >= 2


def test_get_guide_by_id(client):
    create_res = client.post(
        "/api/v1/guides",
        json={
            "name": "Charlie",
            "email": "charlie@museum.org",
            "specialization": "Science",
        },
    )
    guide_id = create_res.json()["id"]

    response = client.get(f"/api/v1/guides/{guide_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Charlie"


def test_update_guide(client):
    create_res = client.post(
        "/api/v1/guides",
        json={
            "name": "David",
            "email": "david@museum.org",
            "specialization": "Antiquities",
        },
    )
    guide_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/guides/{guide_id}",
        json={"name": "David Bowie", "specialization": "Modern Art"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "David Bowie"
    assert update_res.json()["specialization"] == "Modern Art"


def test_delete_guide(client):
    create_res = client.post(
        "/api/v1/guides",
        json={"name": "Eve", "email": "eve@museum.org", "specialization": "Coins"},
    )
    guide_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/guides/{guide_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/v1/guides/{guide_id}")
    assert get_res.status_code == 404
