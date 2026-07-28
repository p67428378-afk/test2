import pytest
from fastapi import status


@pytest.fixture
def admin_headers(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin@example.com", "password": "adminpassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def investigator_headers(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_audit_logs_admin_success(client, admin_headers):
    response = client.get("/api/v1/audit-log", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)


def test_get_audit_logs_investigator_forbidden(client, investigator_headers):
    response = client.get("/api/v1/audit-log", headers=investigator_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_chain_of_custody_success(client, investigator_headers):
    # Upload evidence
    ev_resp = client.post(
        "/api/v1/evidence/upload",
        headers=investigator_headers,
        json={
            "filename": "weapon.jpg",
            "file_type": "image/jpeg",
            "file_size": 500000,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    )
    evidence_id = ev_resp.json()["id"]

    # Get chain of custody
    coc_resp = client.get(
        f"/api/v1/chain-of-custody/{evidence_id}", headers=investigator_headers
    )
    assert coc_resp.status_code == status.HTTP_200_OK
    data = coc_resp.json()
    assert len(data) >= 1
    assert data[0]["action"] == "UPLOAD"
    assert data[0]["username"] == "test@example.com"


def test_get_chain_of_custody_not_found(client, investigator_headers):
    response = client.get(
        "/api/v1/chain-of-custody/00000000-0000-0000-0000-000000000000",
        headers=investigator_headers,
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
