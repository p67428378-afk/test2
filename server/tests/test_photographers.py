from datetime import date, timedelta


def test_list_photographers(client):
    res = client.get("/api/v1/photographers")
    assert res.status_code == 200
    photographers = res.json()
    assert len(photographers) >= 1
    assert any(
        p["user_id"] == "11111111-1111-1111-1111-111111111111" for p in photographers
    )


def test_get_photographer(client):
    res = client.get("/api/v1/photographers/22222222-2222-2222-2222-222222222222")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "22222222-2222-2222-2222-222222222222"
    assert "Elena Rostova" in data["full_name"]


def test_get_photographer_slots(client):
    target_date = (date.today() + timedelta(days=7)).isoformat()
    res = client.get(
        f"/api/v1/photographers/22222222-2222-2222-2222-222222222222/slots?date={target_date}"
    )
    assert res.status_code == 200
    slots = res.json()
    assert isinstance(slots, list)
    assert len(slots) > 0
    assert all("is_available" in s for s in slots)


def test_set_availability_and_conflict_warning(
    client, photographer_headers, customer_headers
):
    photo_id = "22222222-2222-2222-2222-222222222222"
    pkg_id = "33333333-3333-3333-3333-333333333331"

    target_date = date.today() + timedelta(days=14)
    start_time_iso = f"{target_date.isoformat()}T14:00:00"

    # 1. Customer books a session on target_date
    book_res = client.post(
        "/api/v1/sessions",
        json={
            "photographer_id": photo_id,
            "package_id": pkg_id,
            "start_time": start_time_iso,
            "event_notes": "Conflict test shoot",
        },
        headers=customer_headers,
    )
    assert book_res.status_code == 201
    session_id = book_res.json()["id"]

    # 2. Photographer blocks target_date -> Should trigger conflict warning
    avail_payload = {
        "date": target_date.isoformat(),
        "start_time": "09:00",
        "end_time": "17:00",
        "is_blocked": True,
        "reason": "Personal Vacation",
    }
    block_res = client.post(
        f"/api/v1/photographers/{photo_id}/availability",
        json=avail_payload,
        headers=photographer_headers,
    )
    assert block_res.status_code == 200
    data = block_res.json()
    assert data["warning"] is not None
    assert "Conflict Alert" in data["warning"]
    assert len(data["conflicting_sessions"]) >= 1
    assert data["conflicting_sessions"][0]["session_id"] == session_id
