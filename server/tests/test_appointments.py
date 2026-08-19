from datetime import datetime, timezone, timedelta


def test_create_and_list_appointment(client, auth_headers):
    # 1. Create a pet
    pet_resp = client.post(
        "/api/v1/pets", json={"name": "Luna", "species": "Dog"}, headers=auth_headers
    )
    pet_id = pet_resp.json()["id"]

    # 2. Book appointment
    appt_time = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    create_resp = client.post(
        "/api/v1/appointments",
        json={
            "pet_id": pet_id,
            "appointment_date": appt_time,
            "reason": "Annual Wellness Checkup",
            "notes": "Please check vaccination history",
        },
        headers=auth_headers,
    )
    assert create_resp.status_code == 201, create_resp.text
    data = create_resp.json()
    assert data["pet_id"] == pet_id
    assert data["status"] == "SCHEDULED"
    appt_id = data["id"]

    # 3. List appointments
    list_resp = client.get(f"/api/v1/appointments?pet_id={pet_id}")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert len(list_data) >= 1
    assert list_data[0]["id"] == appt_id


def test_update_appointment_status(client, auth_headers):
    # Create pet & appointment
    pet_id = client.post(
        "/api/v1/pets",
        json={"name": "Charlie", "species": "Bird"},
        headers=auth_headers,
    ).json()["id"]

    appt_id = client.post(
        "/api/v1/appointments",
        json={
            "pet_id": pet_id,
            "appointment_date": (
                datetime.now(timezone.utc) + timedelta(days=1)
            ).isoformat(),
            "reason": "Wing Check",
        },
        headers=auth_headers,
    ).json()["id"]

    # Update status
    update_resp = client.put(
        f"/api/v1/appointments/{appt_id}/status",
        json={"status": "COMPLETED", "notes": "Patient healthy"},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["status"] == "COMPLETED"
    assert data["notes"] == "Patient healthy"
