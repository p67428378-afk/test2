def test_list_paintings(client):
    response = client.get("/api/v1/paintings")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1


def test_filter_paintings_by_style(client):
    response = client.get("/api/v1/paintings?style=Abstract")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["style"].lower() == "abstract"


def test_search_paintings_no_results(client):
    response = client.get("/api/v1/paintings?search=NonExistentArtworkX123")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["suggestions"] is not None
    assert len(data["suggestions"]) > 0


def test_get_painting_detail(client):
    # Get list first
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    detail_res = client.get(f"/api/v1/paintings/{painting_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == painting_id


def test_list_frame_options(client):
    response = client.get("/api/v1/frame-options")
    assert response.status_code == 200
    assert len(response.json()) >= 1
