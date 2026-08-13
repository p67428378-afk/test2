def test_get_empty_cart(client):
    response = client.get("/api/v1/cart")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert float(data["subtotal"]) == 0.0
    assert float(data["total"]) == 0.0


def test_add_item_to_cart(client):
    # Get a valid painting ID
    paintings_resp = client.get("/api/v1/paintings")
    painting_id = paintings_resp.json()["items"][0]["id"]

    # Add to cart
    response = client.post("/api/v1/cart/items", json={"painting_id": painting_id})
    assert response.status_code == 200
    data = response.json()
    assert "item" in data
    assert data["item"]["painting_id"] == painting_id
    assert data["item"]["quantity"] == 1

    # Get cart and verify
    cart_resp = client.get("/api/v1/cart")
    cart_data = cart_resp.json()
    assert len(cart_data["items"]) == 1
    assert cart_data["items"][0]["painting_id"] == painting_id


def test_add_duplicate_item_to_cart(client):
    # Get a valid painting ID
    paintings_resp = client.get("/api/v1/paintings")
    painting_id = paintings_resp.json()["items"][0]["id"]

    # Add to cart first time
    client.post("/api/v1/cart/items", json={"painting_id": painting_id})

    # Add to cart second time
    response = client.post("/api/v1/cart/items", json={"painting_id": painting_id})
    assert response.status_code == 400
    assert response.json()["detail"] == "This item is already in your cart"


def test_remove_item_from_cart(client):
    # Get a valid painting ID
    paintings_resp = client.get("/api/v1/paintings")
    painting_id = paintings_resp.json()["items"][0]["id"]

    # Add to cart
    add_resp = client.post("/api/v1/cart/items", json={"painting_id": painting_id})
    item_id = add_resp.json()["item"]["id"]

    # Remove from cart
    response = client.delete(f"/api/v1/cart/items/{item_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Item removed from cart successfully"

    # Verify cart is empty
    cart_resp = client.get("/api/v1/cart")
    assert cart_resp.json()["items"] == []
