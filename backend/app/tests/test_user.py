def test_create_user(test_client):
    response = test_client.post(
        "/api/v1/users/",
        json={"email": "test@example.com", "name": "Test User", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
    assert "accounts" in data
