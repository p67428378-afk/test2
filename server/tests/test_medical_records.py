def test_create_and_get_medical_record(client, auth_headers):
    # Create pet
    pet_id = client.post(
        "/api/v1/pets", json={"name": "Rocky", "species": "Dog"}, headers=auth_headers
    ).json()["id"]

    # Log medical record
    rec_resp = client.post(
        "/api/v1/medical-records",
        json={
            "pet_id": pet_id,
            "diagnosis": "Ear Infection",
            "treatment": "Ear drop cleaning",
            "prescriptions": "Antibiotic drops",
            "notes": "Follow up in 2 weeks",
        },
        headers=auth_headers,
    )
    assert rec_resp.status_code == 201, rec_resp.text
    rec_data = rec_resp.json()
    assert rec_data["pet_id"] == pet_id
    assert rec_data["diagnosis"] == "Ear Infection"

    # Get records for pet
    get_resp = client.get(f"/api/v1/pets/{pet_id}/medical-records")
    assert get_resp.status_code == 200
    list_data = get_resp.json()
    assert len(list_data) == 1
    assert list_data[0]["diagnosis"] == "Ear Infection"
