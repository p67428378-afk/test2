import pytest
from fastapi import status


@pytest.fixture
def auth_headers(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_case_success(client, auth_headers):
    response = client.post(
        "/api/v1/cases",
        headers=auth_headers,
        json={"case_number": "CASE-2026-0001", "description": "Robbery at 5th Avenue"},
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["case_number"] == "CASE-2026-0001"
    assert "id" in data


def test_create_case_duplicate(client, auth_headers):
    client.post(
        "/api/v1/cases",
        headers=auth_headers,
        json={"case_number": "CASE-2026-0002", "description": "First case"},
    )
    response = client.post(
        "/api/v1/cases",
        headers=auth_headers,
        json={"case_number": "CASE-2026-0002", "description": "Second case"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_list_cases(client, auth_headers):
    # Create a case
    client.post(
        "/api/v1/cases",
        headers=auth_headers,
        json={"case_number": "CASE-2026-0003", "description": "List test case"},
    )
    response = client.get("/api/v1/cases", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert "evidence_count" in data[0]


def test_assign_evidence_to_case(client, auth_headers):
    # Create case
    case_resp = client.post(
        "/api/v1/cases",
        headers=auth_headers,
        json={"case_number": "CASE-2026-0004", "description": "Assign test case"},
    )
    case_id = case_resp.json()["id"]

    # Upload evidence
    ev_resp = client.post(
        "/api/v1/evidence/upload",
        headers=auth_headers,
        json={
            "filename": "fingerprint.png",
            "file_type": "image/png",
            "file_size": 2048,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    )
    evidence_id = ev_resp.json()["id"]

    # Assign evidence
    assign_resp = client.post(
        f"/api/v1/cases/{case_id}/evidence",
        headers=auth_headers,
        json={"evidence_id": evidence_id},
    )
    assert assign_resp.status_code == status.HTTP_200_OK
    assert assign_resp.json()["case_id"] == case_id

    # Get case evidence
    list_resp = client.get(f"/api/v1/cases/{case_id}/evidence", headers=auth_headers)
    assert list_resp.status_code == status.HTTP_200_OK
    evidence_list = list_resp.json()
    assert len(evidence_list) == 1
    assert evidence_list[0]["id"] == evidence_id
