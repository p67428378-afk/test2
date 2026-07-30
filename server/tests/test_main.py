import uuid


def test_read_animals(client):
    # AC: Animal Information - Detailed info when selecting an animal. Search functionality by name.
    response = client.get("/api/v1/animals")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

    # Verify fields
    animal = data[0]
    assert "id" in animal
    assert "name" in animal
    assert "species" in animal
    assert "status" in animal
    assert "enclosure_id" in animal
    assert "habitat" in animal
    assert "diet" in animal
    assert "conservation_status" in animal
    assert "image_url" in animal
    assert "qr_code" in animal


def test_search_animals_by_name(client):
    # AC: Animal Information - Search functionality by name.
    response = client.get("/api/v1/animals?name=Simba")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Simba"


def test_read_animal_by_id(client):
    # AC: Animal Information - Detailed info when selecting an animal.
    # Simba's seeded ID is 33333333-3333-3333-3333-333333333333
    simba_id = "33333333-3333-3333-3333-333333333333"
    response = client.get(f"/api/v1/animals/{simba_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Simba"
    assert data["species"] == "Lion"
    assert data["habitat"] == "Savannah"
    assert data["diet"] == "Carnivore"
    assert data["conservation_status"] == "Vulnerable"


def test_read_animal_not_found(client):
    # AC: Animal Information - Detailed info when selecting an animal (error case).
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/animals/{random_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Animal not found"


def test_read_enclosures(client):
    # AC: Interactive Map - Display interactive map of the zoo with animal enclosures.
    response = client.get("/api/v1/enclosures")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

    enclosure = data[0]
    assert "id" in enclosure
    assert "name" in enclosure
    assert "location_x" in enclosure
    assert "location_y" in enclosure
    assert "description" in enclosure


def test_read_map(client):
    # AC: Interactive Map - Display interactive map of the zoo with current location, animal enclosures, facilities, and points of interest.
    response = client.get("/api/v1/map")
    assert response.status_code == 200
    data = response.json()

    assert "enclosures" in data
    assert "facilities" in data
    assert "paths" in data

    assert len(data["enclosures"]) >= 2
    assert len(data["facilities"]) >= 2
    assert len(data["paths"]) >= 2
