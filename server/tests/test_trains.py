def test_read_trains(client):
    response = client.get("/api/v1/trains")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    train_numbers = [t["train_number"] for t in data]
    assert "TR-101" in train_numbers


def test_read_train_by_id(client):
    trains_res = client.get("/api/v1/trains")
    assert trains_res.status_code == 200
    trains = trains_res.json()
    assert len(trains) > 0
    target_id = trains[0]["id"]

    response = client.get(f"/api/v1/trains/{target_id}")
    assert response.status_code == 200
    train_detail = response.json()
    assert train_detail["id"] == target_id
    assert "train_number" in train_detail
    assert "schedules" in train_detail
    assert "delay_alerts" in train_detail


def test_read_train_not_found(client):
    response = client.get("/api/v1/trains/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert (
        response.json()["detail"]
        == "Train with ID '00000000-0000-0000-0000-000000000000' not found."
    )
