def test_get_new_cart(client):
    response = client.get("/api/v1/cart")
    assert response.status_code == 200
    data = response.json()
    assert "cart_id" in data
    assert data["subtotal"] == 0.0
    assert data["items"] == []


def test_add_item_to_cart_success(client):
    # Get a chocolate
    choc = client.get("/api/v1/chocolates").json()[0]
    choc_id = choc["id"]
    price = choc["price"]

    # Add 2 items
    payload = {
        "chocolate_id": choc_id,
        "quantity": 2,
    }
    response = client.post("/api/v1/cart/items", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2
    assert data["subtotal"] == round(price * 2, 2)
    assert data["updated_items_count"] == 2

    cart_id = data["cart_id"]

    # Fetch cart with cart_id
    fetch_resp = client.get(f"/api/v1/cart?cart_id={cart_id}")
    assert fetch_resp.status_code == 200
    assert fetch_resp.json()["cart_id"] == cart_id
    assert len(fetch_resp.json()["items"]) == 1


def test_add_item_exceeding_stock(client):
    # Find out-of-stock or low-stock chocolate
    chocs = client.get("/api/v1/chocolates").json()
    out_of_stock = next((c for c in chocs if c["stock_quantity"] == 0), None)

    if out_of_stock:
        payload = {
            "chocolate_id": out_of_stock["id"],
            "quantity": 1,
        }
        response = client.post("/api/v1/cart/items", json=payload)
        assert response.status_code == 400
        assert "remaining in stock" in response.json()["detail"]

    # Test with quantity > available stock
    in_stock = next(c for c in chocs if c["stock_quantity"] > 0)
    excess_payload = {
        "chocolate_id": in_stock["id"],
        "quantity": in_stock["stock_quantity"] + 10,
    }
    excess_resp = client.post("/api/v1/cart/items", json=excess_payload)
    assert excess_resp.status_code == 400
    assert (
        f"Only {in_stock['stock_quantity']} items remaining in stock."
        in excess_resp.json()["detail"]
    )


def test_update_cart_item_quantity(client):
    choc = client.get("/api/v1/chocolates").json()[0]
    add_resp = client.post(
        "/api/v1/cart/items", json={"chocolate_id": choc["id"], "quantity": 1}
    )
    cart_data = add_resp.json()
    item_id = cart_data["items"][0]["id"]

    # Update quantity to 3
    update_resp = client.put(f"/api/v1/cart/items/{item_id}", json={"quantity": 3})
    assert update_resp.status_code == 200
    assert update_resp.json()["quantity"] == 3
    assert update_resp.json()["item_subtotal"] == round(choc["price"] * 3, 2)


def test_update_cart_item_exceeding_stock(client):
    chocs = client.get("/api/v1/chocolates").json()
    low_stock = next(c for c in chocs if 0 < c["stock_quantity"] <= 5)
    add_resp = client.post(
        "/api/v1/cart/items", json={"chocolate_id": low_stock["id"], "quantity": 1}
    )
    item_id = add_resp.json()["items"][0]["id"]

    # Try updating to stock + 5
    update_resp = client.put(
        f"/api/v1/cart/items/{item_id}",
        json={"quantity": low_stock["stock_quantity"] + 5},
    )
    assert update_resp.status_code == 400
    assert "remaining in stock" in update_resp.json()["detail"]


def test_remove_cart_item(client):
    choc = client.get("/api/v1/chocolates").json()[0]
    add_resp = client.post(
        "/api/v1/cart/items", json={"chocolate_id": choc["id"], "quantity": 1}
    )
    cart_id = add_resp.json()["cart_id"]
    item_id = add_resp.json()["items"][0]["id"]

    del_resp = client.delete(f"/api/v1/cart/items/{item_id}")
    assert del_resp.status_code == 200
    assert "removed successfully" in del_resp.json()["message"]

    # Verify cart is now empty
    fetch_resp = client.get(f"/api/v1/cart?cart_id={cart_id}")
    assert fetch_resp.status_code == 200
    assert len(fetch_resp.json()["items"]) == 0
    assert fetch_resp.json()["subtotal"] == 0.0
