def test_create_pet(client, auth_headers):
    response = client.post(
        "/api/v1/pets",
        json={
            "name": "Buddy",
            "species": "Dog",
            "breed": "Golden Retriever",
            "age": 3,
            "weight": 25.5,
            "gender": "Male",
            "microchip_number": "MC123456",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Buddy"
    assert data["species"] == "Dog"
    assert data["breed"] == "Golden Retriever"
    assert "id" in data


def test_list_pets(client):
    response = client.get("/api/v1/pets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_pet_by_id(client, auth_headers):
    # First create a pet
    create_resp = client.post(
        "/api/v1/pets",
        json={"name": "Milo", "species": "Cat", "age": 2},
        headers=auth_headers,
    )
    assert create_resp.status_code == 201
    pet_id = create_resp.json()["id"]

    # Get pet
    get_resp = client.get(f"/api/v1/pets/{pet_id}")
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert data["name"] == "Milo"
    assert data["species"] == "Cat"


def test_update_pet(client, auth_headers):
    # Create pet
    create_resp = client.post(
        "/api/v1/pets",
        json={"name": "Max", "species": "Dog", "weight": 10.0},
        headers=auth_headers,
    )
    pet_id = create_resp.json()["id"]

    # Update pet
    update_resp = client.put(
        f"/api/v1/pets/{pet_id}", json={"weight": 12.5, "age": 4}, headers=auth_headers
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["weight"] == 12.5
    assert data["age"] == 4
