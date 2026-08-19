from datetime import datetime, timezone, timedelta


def test_create_and_get_vaccination(client, auth_headers):
    # Create pet
    pet_id = client.post(
        "/api/v1/pets", json={"name": "Coco", "species": "Cat"}, headers=auth_headers
    ).json()["id"]

    next_due = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()

    # Record vaccination
    vax_resp = client.post(
        "/api/v1/vaccinations",
        json={
            "pet_id": pet_id,
            "vaccine_name": "Rabies",
            "next_due_date": next_due,
            "status": "UP_TO_DATE",
        },
        headers=auth_headers,
    )
    assert vax_resp.status_code == 201, vax_resp.text
    vax_data = vax_resp.json()
    assert vax_data["pet_id"] == pet_id
    assert vax_data["vaccine_name"] == "Rabies"
    assert vax_data["status"] == "UP_TO_DATE"

    # Get vaccinations for pet
    get_resp = client.get(f"/api/v1/pets/{pet_id}/vaccinations")
    assert get_resp.status_code == 200
    list_data = get_resp.json()
    assert len(list_data) == 1
    assert list_data[0]["vaccine_name"] == "Rabies"
