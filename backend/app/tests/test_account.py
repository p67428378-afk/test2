def test_create_account_for_user(test_client):
    # First, create a user
    user_response = test_client.post(
        "/api/v1/users/",
        json={"email": "test2@example.com", "name": "Test User 2", "password": "testpassword"},
    )
    assert user_response.status_code == 200
    user_data = user_response.json()
    user_id = user_data["id"]

    # Then, create an account for that user
    account_response = test_client.post(
        f"/api/v1/users/{user_id}/accounts/",
        json={"account_number": "1234567890", "account_type": "checking", "balance": 1500.00, "currency": "USD"},
    )
    assert account_response.status_code == 200
    account_data = account_response.json()
    assert account_data["account_number"] == "1234567890"
    assert account_data["account_type"] == "checking"
    assert account_data["balance"] == 1500.00
    assert account_data["currency"] == "USD"
    assert account_data["user_id"] == user_id

def test_get_user_accounts(test_client):
    # First, create a user and accounts
    user_response = test_client.post(
        "/api/v1/users/",
        json={"email": "test3@example.com", "name": "Test User 3", "password": "testpassword"},
    )
    user_data = user_response.json()
    user_id = user_data["id"]
    test_client.post(
        f"/api/v1/users/{user_id}/accounts/",
        json={"account_number": "1111", "account_type": "checking", "balance": 1000.0, "currency": "USD"},
    )
    test_client.post(
        f"/api/v1/users/{user_id}/accounts/",
        json={"account_number": "2222", "account_type": "savings", "balance": 5000.0, "currency": "USD"},
    )

    # Now, get the accounts for the user
    response = test_client.get(f"/api/v1/users/{user_id}/accounts/")
    assert response.status_code == 200
    accounts = response.json()
    assert len(accounts) == 2
    assert accounts[0]["account_number"] == "1111"
    assert accounts[1]["account_number"] == "2222"
