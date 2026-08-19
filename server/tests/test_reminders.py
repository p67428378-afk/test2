from datetime import datetime, timezone, timedelta


def test_process_reminders_and_list(client, auth_headers):
    # Create pet
    pet_id = client.post(
        "/api/v1/pets", json={"name": "Daisy", "species": "Dog"}, headers=auth_headers
    ).json()["id"]

    # Record vaccination due in 5 days
    due_date = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    client.post(
        "/api/v1/vaccinations",
        json={
            "pet_id": pet_id,
            "vaccine_name": "DHPP",
            "next_due_date": due_date,
            "status": "DUE_SOON",
        },
        headers=auth_headers,
    )

    # Trigger process reminders
    proc_resp = client.post("/api/v1/reminders/process", headers=auth_headers)
    assert proc_resp.status_code == 200, proc_resp.text
    proc_data = proc_resp.json()
    assert proc_data["processed_count"] >= 1
    assert len(proc_data["reminders"]) >= 1

    # List reminders
    list_resp = client.get(f"/api/v1/reminders?pet_id={pet_id}")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert len(list_data) >= 1
    assert list_data[0]["reminder_type"] == "VACCINATION"
