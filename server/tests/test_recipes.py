def test_create_recipe(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]

    # Get categories to find a valid category_id
    cat_response = client.get("/api/v1/categories")
    category_id = cat_response.json()[0]["id"]

    # Create recipe
    response = client.post(
        "/api/v1/recipes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Scrambled Eggs",
            "description": "Quick and fluffy scrambled eggs",
            "prep_time": 5,
            "cook_time": 5,
            "servings": 2,
            "instructions": "Whisk eggs, pour into hot pan, stir until cooked.",
            "category_id": category_id,
            "ingredients": [
                {"name": "Eggs", "quantity": "4", "unit": "pcs"},
                {"name": "Butter", "quantity": "1", "unit": "tbsp"},
            ],
            "dietary_tag_ids": [],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Scrambled Eggs"
    assert len(data["ingredients"]) == 2
    assert data["category"]["id"] == category_id


def test_list_recipes_and_search(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]

    # Create a recipe
    client.post(
        "/api/v1/recipes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Pancakes",
            "description": "Fluffy buttermilk pancakes",
            "prep_time": 10,
            "cook_time": 15,
            "servings": 4,
            "instructions": "Mix ingredients, cook on griddle.",
            "ingredients": [{"name": "Flour", "quantity": "2", "unit": "cups"}],
            "dietary_tag_ids": [],
        },
    )

    # List recipes
    response = client.get("/api/v1/recipes")
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Search recipes
    response = client.get("/api/v1/recipes?search=Pancake")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Pancakes"


def test_get_recipe_by_id(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]

    # Create recipe
    create_response = client.post(
        "/api/v1/recipes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Pasta",
            "description": "Simple tomato pasta",
            "prep_time": 10,
            "cook_time": 20,
            "servings": 2,
            "instructions": "Boil pasta, add sauce.",
            "ingredients": [{"name": "Pasta", "quantity": "200", "unit": "g"}],
            "dietary_tag_ids": [],
        },
    )
    recipe_id = create_response.json()["id"]

    # Get recipe
    response = client.get(f"/api/v1/recipes/{recipe_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Pasta"


def test_update_recipe(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]

    # Create recipe
    create_response = client.post(
        "/api/v1/recipes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Salad",
            "description": "Green salad",
            "prep_time": 5,
            "cook_time": 0,
            "servings": 1,
            "instructions": "Chop and mix.",
            "ingredients": [{"name": "Lettuce", "quantity": "1", "unit": "head"}],
            "dietary_tag_ids": [],
        },
    )
    recipe_id = create_response.json()["id"]

    # Update recipe
    response = client.put(
        f"/api/v1/recipes/{recipe_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Super Salad", "prep_time": 10},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Super Salad"
    assert response.json()["prep_time"] == 10


def test_delete_recipe(client):
    # Login
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]

    # Create recipe
    create_response = client.post(
        "/api/v1/recipes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Soup",
            "description": "Hot soup",
            "prep_time": 10,
            "cook_time": 30,
            "servings": 4,
            "instructions": "Boil everything.",
            "ingredients": [],
            "dietary_tag_ids": [],
        },
    )
    recipe_id = create_response.json()["id"]

    # Delete recipe
    response = client.delete(
        f"/api/v1/recipes/{recipe_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 204

    # Verify deleted
    get_response = client.get(f"/api/v1/recipes/{recipe_id}")
    assert get_response.status_code == 404
