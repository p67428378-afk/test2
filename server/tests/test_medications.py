def test_list_medications(client):
    # AC: Pharmacy Management: Retrieve a list of medications in the pharmacy catalog via GET /api/v1/medications
    # Create a medication first
    client.post(
        "/api/v1/medications",
        json={
            "name": "Aspirin",
            "code": "ASP100",
            "description": "Blood thinner",
            "price": 5.50,
            "stock_quantity": 200,
        },
    )
    response = client.get("/api/v1/medications")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(m["name"] == "Aspirin" for m in data)
