def test_delivery_lifecycle(client):
    # 1. Log Delivery
    create_response = client.post(
        "/api/v1/deliveries",
        json={
            "unit_number": "4B",
            "courier_company": "FedEx",
            "tracking_number": "FX-998822",
        },
    )
    assert create_response.status_code == 201
    data = create_response.json()
    assert data["unit_number"] == "4B"
    assert data["courier_company"] == "FedEx"
    assert data["status"] == "Pending Pickup"
    delivery_id = data["id"]

    # 2. List Deliveries
    list_response = client.get("/api/v1/deliveries?unit_number=4B")
    assert list_response.status_code == 200
    deliveries = list_response.json()
    assert len(deliveries) >= 1
    assert deliveries[0]["id"] == delivery_id

    # 3. Acknowledge Pickup
    pickup_response = client.put(f"/api/v1/deliveries/{delivery_id}/pickup")
    assert pickup_response.status_code == 200
    p_data = pickup_response.json()
    assert p_data["status"] == "Collected"
    assert p_data["collected_at"] is not None


def test_pickup_non_existent_delivery(client):
    response = client.put("/api/v1/deliveries/invalid-id-123/pickup")
    assert response.status_code == 404
