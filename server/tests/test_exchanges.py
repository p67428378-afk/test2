from fastapi.testclient import TestClient


def test_exchange_request_lifecycle(client: TestClient):
    # Get test user profile to find offered_skill_id (Python TEACH)
    test_profile = client.get(
        "/api/v1/profiles/me", headers={"X-User-Email": "test@example.com"}
    ).json()
    test_python_skill = next(
        s
        for s in test_profile["teach_skills"]
        if s["skill_name"] == "Python Programming"
    )

    # Get partner1 profile to find requested_skill_id (React TEACH) and partner1's user_id
    p1_profile = client.get(
        "/api/v1/profiles/me", headers={"X-User-Email": "partner1@example.com"}
    ).json()
    p1_id = p1_profile["id"]
    p1_react_skill = next(
        s for s in p1_profile["teach_skills"] if s["skill_name"] == "React Framework"
    )

    # 1. Create exchange request
    create_payload = {
        "recipient_id": p1_id,
        "offered_skill_id": test_python_skill["id"],
        "requested_skill_id": p1_react_skill["id"],
        "message": "Hi Alice, let's exchange Python for React!",
    }
    res_create = client.post(
        "/api/v1/exchanges",
        json=create_payload,
        headers={"X-User-Email": "test@example.com"},
    )
    assert res_create.status_code == 201
    exchange_data = res_create.json()
    exchange_id = exchange_data["id"]
    assert exchange_data["status"] == "PENDING"
    assert exchange_data["requester_name"] == "Test User"
    assert exchange_data["recipient_name"] == "Alice Partner"

    # 2. Prevent duplicate pending request
    res_dup = client.post(
        "/api/v1/exchanges",
        json=create_payload,
        headers={"X-User-Email": "test@example.com"},
    )
    assert res_dup.status_code == 400
    assert "already exists" in res_dup.json()["detail"]

    # 3. List requests as recipient (incoming for partner1)
    res_in = client.get(
        "/api/v1/exchanges?role_filter=incoming",
        headers={"X-User-Email": "partner1@example.com"},
    )
    assert res_in.status_code == 200
    incoming_list = res_in.json()
    assert len(incoming_list) >= 1
    assert incoming_list[0]["id"] == exchange_id

    # 4. Accept exchange request as recipient
    res_accept = client.patch(
        f"/api/v1/exchanges/{exchange_id}/status",
        json={"action": "ACCEPT"},
        headers={"X-User-Email": "partner1@example.com"},
    )
    assert res_accept.status_code == 200
    assert res_accept.json()["status"] == "ACCEPTED"

    # 5. Prohibit status change on non-pending request
    res_reaccept = client.patch(
        f"/api/v1/exchanges/{exchange_id}/status",
        json={"action": "REJECT"},
        headers={"X-User-Email": "partner1@example.com"},
    )
    assert res_reaccept.status_code == 400
    assert "Only PENDING requests can be updated" in res_reaccept.json()["detail"]


def test_exchange_cancel_workflow(client: TestClient):
    test_profile = client.get(
        "/api/v1/profiles/me", headers={"X-User-Email": "test@example.com"}
    ).json()
    test_python_skill = next(
        s
        for s in test_profile["teach_skills"]
        if s["skill_name"] == "Python Programming"
    )

    p2_profile = client.get(
        "/api/v1/profiles/me", headers={"X-User-Email": "partner2@example.com"}
    ).json()
    p2_id = p2_profile["id"]
    p2_spanish_skill = next(
        s for s in p2_profile["teach_skills"] if s["skill_name"] == "Spanish Language"
    )

    # Create request
    create_payload = {
        "recipient_id": p2_id,
        "offered_skill_id": test_python_skill["id"],
        "requested_skill_id": p2_spanish_skill["id"],
        "message": "Hey Bob, let's swap Python for Spanish!",
    }
    res_create = client.post(
        "/api/v1/exchanges",
        json=create_payload,
        headers={"X-User-Email": "test@example.com"},
    )
    assert res_create.status_code == 201
    exchange_id = res_create.json()["id"]

    # Cancel request as requester
    res_cancel = client.patch(
        f"/api/v1/exchanges/{exchange_id}/status",
        json={"action": "CANCEL"},
        headers={"X-User-Email": "test@example.com"},
    )
    assert res_cancel.status_code == 200
    assert res_cancel.json()["status"] == "CANCELLED"
