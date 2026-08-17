def test_ai_match_suggestions_success(client, user_token):
    # AC: AI-Powered Match Suggestions - Happy Path
    # 1. Report a found item
    found_payload = {
        "type": "found",
        "category": "Electronics",
        "name": "Black iPhone 15 Pro",
        "description": "Found a black iPhone 15 with a cracked screen protector near the cafeteria",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "admin@example.com",
    }
    found_resp = client.post(
        "/api/v1/items",
        json=found_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert found_resp.status_code == 201

    # 2. Report a lost item
    lost_payload = {
        "type": "lost",
        "category": "Electronics",
        "name": "iPhone 15",
        "description": "Black iPhone 15 with a cracked screen protector",
        "location": "Building A Cafeteria",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "test@example.com",
    }
    lost_resp = client.post(
        "/api/v1/items",
        json=lost_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert lost_resp.status_code == 201
    lost_item_id = lost_resp.json()["id"]

    # 3. Get matches
    matches_resp = client.get(
        f"/api/v1/items/{lost_item_id}/matches",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert matches_resp.status_code == 200
    matches = matches_resp.json()
    assert len(matches) > 0
    assert matches[0]["similarity_score"] >= 60.0
    assert matches[0]["matched_item"]["name"] == "Black iPhone 15 Pro"


def test_ai_match_suggestions_no_matches(client, user_token):
    # AC: AI-Powered Match Suggestions - Edge Case: No matches found
    lost_payload = {
        "type": "lost",
        "category": "Books",
        "name": "Advanced Calculus",
        "description": "Hardcover textbook",
        "location": "Library",
        "date_incident": "2026-05-18T12:00:00Z",
        "contact_info": "test@example.com",
    }
    lost_resp = client.post(
        "/api/v1/items",
        json=lost_payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert lost_resp.status_code == 201
    lost_item_id = lost_resp.json()["id"]

    matches_resp = client.get(
        f"/api/v1/items/{lost_item_id}/matches",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert matches_resp.status_code == 200
    assert len(matches_resp.json()) == 0
