def test_create_doctor(client):
    # AC: Doctor Appointments: Add a new doctor to the system via POST /api/v1/doctors
    response = client.post(
        "/api/v1/doctors",
        json={
            "name": "Dr. Gregory House",
            "specialty": "Diagnostic Medicine",
            "phone": "555-0102",
            "email": "house@example.com",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Dr. Gregory House"
    assert "id" in data


def test_list_doctors(client):
    # AC: Doctor Appointments: Retrieve a list of doctors via GET /api/v1/doctors
    client.post(
        "/api/v1/doctors",
        json={"name": "Dr. John Watson", "specialty": "General Practice"},
    )
    response = client.get("/api/v1/doctors")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(d["name"] == "Dr. John Watson" for d in data)
