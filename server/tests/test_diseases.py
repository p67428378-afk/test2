def test_disease_report_and_quarantine(client):
    hives_resp = client.get("/api/v1/hives")
    assert hives_resp.status_code == 200
    hive_id = hives_resp.json()[0]["id"]

    payload = {
        "hive_id": hive_id,
        "disease_name": "American Foulbrood",
        "severity_level": "Critical",
        "symptoms_description": "Larvae sunken and dark, foul odor detected.",
        "treatment_applied": "Hive isolated for burning / antibiotic protocol.",
    }

    report_resp = client.post("/api/v1/diseases/reports", json=payload)
    assert report_resp.status_code == 201
    data = report_resp.json()
    assert data["disease_name"] == "American Foulbrood"
    assert data["severity_level"] == "Critical"

    # Verify hive status updated to quarantined automatically
    get_hive_resp = client.get(f"/api/v1/hives/{hive_id}")
    assert get_hive_resp.status_code == 200
    assert get_hive_resp.json()["status"] == "quarantined"

    # List disease reports
    list_resp = client.get(f"/api/v1/diseases/reports?hive_id={hive_id}")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1
