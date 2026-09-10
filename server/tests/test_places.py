def test_list_tourist_places(client):
    response = client.get("/api/v1/tourist-places")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6


def test_filter_tourist_places_by_district(client):
    response = client.get("/api/v1/tourist-places?district=Wayanad")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any("Chembra" in place["title"] for place in data)


def test_filter_tourist_places_by_search(client):
    response = client.get("/api/v1/tourist-places?search=waterboat")
    assert response.status_code == 200

    response2 = client.get("/api/v1/tourist-places?search=Munnar")
    assert response2.status_code == 200
    data2 = response2.json()
    assert len(data2) >= 1
    assert "Munnar" in data2[0]["title"]


def test_filter_tourist_places_by_category(client):
    cat_res = client.get("/api/v1/categories")
    categories = cat_res.json()
    backwaters_cat = next(c for c in categories if c["slug"] == "backwaters")

    response = client.get(f"/api/v1/tourist-places?category_id={backwaters_cat['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(place["category_id"] == backwaters_cat["id"] for place in data)


def test_filter_tourist_places_by_fee_range(client):
    response = client.get("/api/v1/tourist-places?min_fee=50&max_fee=100")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(place["title"] == "Wayanad Chembra Peak" for place in data)


def test_get_tourist_place_detail(client):
    places_res = client.get("/api/v1/tourist-places")
    places = places_res.json()
    chembra = next(p for p in places if "Chembra" in p["title"])

    response = client.get(f"/api/v1/tourist-places/{chembra['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == chembra["id"]
    assert data["title"] == "Wayanad Chembra Peak"
    assert data["operating_hours"] == "7 AM - 2 PM"
    assert data["entry_fee"] == 75.0
    assert "category" in data
    assert "media_assets" in data
    assert "reviews" in data
    assert "nearby_attractions" in data


def test_get_tourist_place_not_found(client):
    response = client.get("/api/v1/tourist-places/non-existent-id")
    assert response.status_code == 404


def test_create_tourist_place(client):
    cat_res = client.get("/api/v1/categories")
    cat_id = cat_res.json()[0]["id"]

    new_place = {
        "category_id": cat_id,
        "title": "Athirappilly Waterfalls",
        "summary": "The Niagara of India located in Thrissur district.",
        "description": "Athirappilly Falls is the largest waterfall in Kerala, standing 80 feet tall.",
        "district": "Thrissur",
        "state_region": "Kerala",
        "cover_image_url": "https://example.com/athirappilly.jpg",
        "latitude": 10.2852,
        "longitude": 76.5698,
        "best_time_to_visit": "September to January",
        "operating_hours": "8 AM - 6 PM",
        "entry_fee": 50.0,
        "permit_requirements": "Entry ticket at counter",
    }

    response = client.post("/api/v1/tourist-places", json=new_place)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Athirappilly Waterfalls"
    assert data["district"] == "Thrissur"
    assert "id" in data


def test_add_media_asset(client):
    places_res = client.get("/api/v1/tourist-places")
    place_id = places_res.json()[0]["id"]

    media_url = "https://example.com/gallery1.jpg"
    response = client.post(
        f"/api/v1/tourist-places/{place_id}/media",
        params={"media_type": "image", "url": media_url, "caption": "Scenic view"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["place_id"] == place_id
    assert data["url"] == media_url
