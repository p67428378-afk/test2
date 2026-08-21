from fastapi.testclient import TestClient


def test_get_matches_for_test_user(client: TestClient):
    response = client.get(
        "/api/v1/matches", headers={"X-User-Email": "test@example.com"}
    )
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) >= 2
    # Verify partner1 (Alice) and partner2 (Bob) are matched
    partner_names = [m["partner_name"] for m in matches]
    assert "Alice Partner" in partner_names
    assert "Bob Partner" in partner_names


def test_get_matches_search_filter(client: TestClient):
    response = client.get(
        "/api/v1/matches?query=React", headers={"X-User-Email": "test@example.com"}
    )
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) >= 1
    assert matches[0]["teaches_skill"]["skill_name"] == "React Framework"


def test_get_matches_reciprocal_filter(client: TestClient):
    response = client.get(
        "/api/v1/matches?reciprocal_only=true",
        headers={"X-User-Email": "test@example.com"},
    )
    assert response.status_code == 200
    matches = response.json()
    for m in matches:
        assert m["is_reciprocal"] is True
        assert m["partner_email"] is not None


def test_get_matches_pagination(client: TestClient):
    response = client.get(
        "/api/v1/matches?skip=0&limit=1", headers={"X-User-Email": "test@example.com"}
    )
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) == 1
