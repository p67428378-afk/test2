def test_add_and_get_cart_items(client):
    cart_id = "test-cart-session-123"

    # Get a painting
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    # Add to cart
    add_payload = {
        "cart_id": cart_id,
        "painting_id": painting_id,
        "quantity": 1,
    }
    add_res = client.post("/api/v1/cart/items", json=add_payload)
    assert add_res.status_code == 200
    cart_data = add_res.json()
    assert cart_data["cart_id"] == cart_id
    assert len(cart_data["items"]) == 1
    assert cart_data["total_items"] == 1

    # Fetch cart
    get_res = client.get(f"/api/v1/cart?cart_id={cart_id}")
    assert get_res.status_code == 200
    assert get_res.json()["total_items"] == 1


def test_remove_cart_item(client):
    cart_id = "test-cart-session-456"
    list_res = client.get("/api/v1/paintings")
    painting_id = list_res.json()["items"][0]["id"]

    add_res = client.post(
        "/api/v1/cart/items",
        json={"cart_id": cart_id, "painting_id": painting_id, "quantity": 1},
    )
    item_id = add_res.json()["items"][0]["id"]

    # Delete item
    del_res = client.delete(f"/api/v1/cart/items/{item_id}?cart_id={cart_id}")
    assert del_res.status_code == 200
    assert del_res.json()["total_items"] == 0
