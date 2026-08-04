def test_get_skus_all(client):
    response = client.get("/api/v1/assortment/skus")
    assert response.status_code == 200
    data = response.json()
    assert "total_skus" in data
    assert "skus" in data
    assert data["total_skus"] >= 1
    first_sku = data["skus"][0]
    assert "sku_id" in first_sku
    assert "product_name" in first_sku
    assert "sub_category" in first_sku
    assert "status_badge" in first_sku


def test_get_skus_filter_category(client):
    response = client.get("/api/v1/assortment/skus?sub_category=Salty Snacks")
    assert response.status_code == 200
    data = response.json()
    for sku in data["skus"]:
        assert "Salty" in sku["sub_category"] or "Snacks" in sku["sub_category"]


def test_get_skus_filter_badge(client):
    response = client.get("/api/v1/assortment/skus?status_badge=GROW")
    assert response.status_code == 200
    data = response.json()
    for sku in data["skus"]:
        assert sku["status_badge"].upper() == "GROW"
