def test_create_crew_member(client):
    payload = {
        "first_name": "Helen",
        "last_name": "Vance",
        "certification": "Chief Scientist",
    }
    response = client.post("/api/v1/crew", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Helen"
    assert data["last_name"] == "Vance"
    assert "id" in data


def test_get_crew_members(client):
    response = client.get("/api/v1/crew")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Since we seed data on startup, there should be seeded crew members
    assert len(data) > 0
