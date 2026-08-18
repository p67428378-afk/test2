def test_toggle_favorites(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]
    user_id = login_response.json()["user"]["id"]

    # Create recipe
    create_response = client.post(
        "/api/v1/recipes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Favorite Cake",
            "description": "Delicious chocolate cake",
            "prep_time": 15,
            "cook_time": 45,
            "servings": 8,
            "instructions": "Bake it.",
            "ingredients": [],
            "dietary_tag_ids": [],
        },
    )
    recipe_id = create_response.json()["id"]

    # Add to favorites
    fav_response = client.post(
        f"/api/v1/users/{user_id}/favorites/{recipe_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert fav_response.status_code == 200
    assert fav_response.json()["detail"] == "Recipe added to favorites"

    # Verify is_favorite is True in detail view
    get_response = client.get(
        f"/api/v1/recipes/{recipe_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.json()["is_favorite"] is True

    # List favorites only
    list_response = client.get(
        "/api/v1/recipes?favorites_only=true",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["title"] == "Favorite Cake"

    # Remove from favorites
    unfav_response = client.delete(
        f"/api/v1/users/{user_id}/favorites/{recipe_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert unfav_response.status_code == 200
    assert unfav_response.json()["detail"] == "Recipe removed from favorites"

    # Verify is_favorite is False
    get_response2 = client.get(
        f"/api/v1/recipes/{recipe_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response2.json()["is_favorite"] is False
