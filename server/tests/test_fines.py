def test_search_fines_by_license_plate(client):
    response = client.get("/api/v1/fines/search?license_plate=ABC-1234")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["license_plate"] == "ABC-1234"
    assert data[0]["ticket_number"] == "FN-98765"


def test_search_fines_by_ticket_number(client):
    response = client.get("/api/v1/fines/search?ticket_number=FN-98765")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["ticket_number"] == "FN-98765"


def test_search_fines_not_found(client):
    response = client.get("/api/v1/fines/search?license_plate=NONEXISTENT")
    assert response.status_code == 404
    assert (
        response.json()["detail"]
        == "No parking fine records found for the provided details"
    )


def test_search_fines_missing_params(client):
    response = client.get("/api/v1/fines/search")
    assert response.status_code == 400


def test_get_fine_status_success(client):
    response = client.get("/api/v1/fines/FN-98765/status")
    assert response.status_code == 200
    data = response.json()
    assert data["ticket_number"] == "FN-98765"
    assert data["status"] == "PAID"
    assert "overdue_penalty" in data
    assert "total_due" in data


def test_get_fine_status_not_found(client):
    response = client.get("/api/v1/fines/INVALID_ID/status")
    assert response.status_code == 404
    assert response.json()["detail"] == "Parking fine record not found"
