def test_list_users(client):
    response = client.get("/api/v1/users")
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
    assert len(users) >= 2
    emails = [u["email"] for u in users]
    assert "test@example.com" in emails
    assert "admin@example.com" in emails


def test_get_user_by_id(client):
    list_resp = client.get("/api/v1/users")
    user_id = list_resp.json()[0]["id"]

    get_resp = client.get(f"/api/v1/users/{user_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == user_id
