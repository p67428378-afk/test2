"""Tests for Saved / Bookmarked Recommendations API endpoints."""


def test_bookmark_and_list_saved_items(client):
    """Verify bookmarking a recommended item and retrieving the saved list."""
    user_id = "test_saved_user_001"
    # 1. Generate a recommendation to get a product
    gen_res = client.post(
        "/api/v1/recommendations/generate",
        json={"user_id": user_id, "limit": 1},
    )
    assert gen_res.status_code == 200
    rec_item = gen_res.json()["recommendations"][0]
    prod_id = rec_item["product"]["id"]
    rec_id = rec_item["recommendation_id"]

    # 2. Bookmark item
    save_res = client.post(
        "/api/v1/recommendations/saved",
        json={
            "user_id": user_id,
            "product_id": prod_id,
            "recommendation_id": rec_id,
        },
    )
    assert save_res.status_code == 201
    save_data = save_res.json()
    assert save_data["user_id"] == user_id
    assert save_data["product_id"] == prod_id
    assert save_data["product"]["id"] == prod_id
    saved_id = save_data["id"]

    # 3. List saved items
    list_res = client.get(
        f"/api/v1/recommendations/saved?user_id={user_id}&skip=0&limit=10"
    )
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["total"] >= 1
    found = any(item["id"] == saved_id for item in list_data["items"])
    assert found

    # 4. Delete saved item
    del_res = client.delete(f"/api/v1/recommendations/saved/{saved_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

    # Verify deleted
    list_after = client.get(f"/api/v1/recommendations/saved?user_id={user_id}")
    assert not any(item["id"] == saved_id for item in list_after.json()["items"])


def test_duplicate_bookmark_conflict(client):
    """Verify duplicate bookmarking on same (user_id, product_id) returns 409 Conflict."""
    user_id = "test_duplicate_bookmark_user"
    prod_res = client.get("/api/v1/products")
    prod_id = prod_res.json()["items"][0]["id"]

    # First bookmark
    res1 = client.post(
        "/api/v1/recommendations/saved",
        json={"user_id": user_id, "product_id": prod_id},
    )
    assert res1.status_code == 201

    # Second bookmark (duplicate)
    res2 = client.post(
        "/api/v1/recommendations/saved",
        json={"user_id": user_id, "product_id": prod_id},
    )
    assert res2.status_code == 409
    assert "already bookmarked" in res2.json()["detail"].lower()


def test_delete_non_existent_saved_item(client):
    """Verify 404 response when deleting non-existent saved item ID."""
    response = client.delete("/api/v1/recommendations/saved/unknown-saved-id-9999")
    assert response.status_code == 404
