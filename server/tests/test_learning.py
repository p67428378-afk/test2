def test_get_learning_items(client):
    response = client.get("/api/v1/learning-items")
    assert response.status_code == 200
    items = response.json()

    # 26 letters + 10 numbers = 36 items
    assert len(items) == 36

    alphabets = [item for item in items if item["type"] == "alphabet"]
    numbers = [item for item in items if item["type"] == "number"]

    assert len(alphabets) == 26
    assert len(numbers) == 10

    # Check fields of an item
    first_item = alphabets[0]
    assert "id" in first_item
    assert "type" in first_item
    assert "value" in first_item
    assert "word_association" in first_item
    assert "image_url" in first_item
    assert "audio_url" in first_item
