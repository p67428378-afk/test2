from datetime import date, timedelta


def test_photoshoot_completion_with_unpaid_notice(
    client, customer_headers, photographer_headers
):
    photo_id = "22222222-2222-2222-2222-222222222222"
    pkg_id = "33333333-3333-3333-3333-333333333331"  # $350

    target_date = date.today() + timedelta(days=30)
    start_time_iso = f"{target_date.isoformat()}T16:00:00"

    # 1. Customer books session
    book_res = client.post(
        "/api/v1/sessions",
        json={
            "photographer_id": photo_id,
            "package_id": pkg_id,
            "start_time": start_time_iso,
            "event_notes": "Editorial portraits",
        },
        headers=customer_headers,
    )
    assert book_res.status_code == 201
    sess_id = book_res.json()["id"]

    # 2. Customer pays only deposit ($175) leaving $175 unpaid
    client.post(
        "/api/v1/payments",
        json={"session_id": sess_id, "amount": 175.00, "payment_method": "credit_card"},
        headers=customer_headers,
    )

    # 3. Photographer records photoshoot completion -> Triggers unpaid notice flag
    record_payload = {
        "gallery_url": "https://gallery.aurastudio.com/proofs/test-shoot",
        "notes": "Outdoor garden shoot finished successfully at sunset. 120 raw proofs uploaded.",
        "is_completed": True,
    }
    res_record = client.post(
        f"/api/v1/sessions/{sess_id}/photoshoot-record",
        json=record_payload,
        headers=photographer_headers,
    )
    assert res_record.status_code == 200
    rec_data = res_record.json()
    assert rec_data["is_completed"] is True
    assert rec_data["unpaid_notice_flag"] is True
    assert rec_data["notice"] is not None
    assert "unpaid remaining balance" in rec_data["notice"]

    # 4. Check session status is now "completed"
    sess_get = client.get(f"/api/v1/sessions/{sess_id}", headers=customer_headers)
    assert sess_get.status_code == 200
    assert sess_get.json()["status"] == "completed"

    # 5. Get photoshoot record for session
    get_rec = client.get(
        f"/api/v1/sessions/{sess_id}/photoshoot-record", headers=photographer_headers
    )
    assert get_rec.status_code == 200
    assert (
        get_rec.json()["gallery_url"]
        == "https://gallery.aurastudio.com/proofs/test-shoot"
    )

    # 6. List photoshoots
    res_list = client.get("/api/v1/photoshoots", headers=photographer_headers)
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1
