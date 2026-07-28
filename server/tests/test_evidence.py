import pytest
from fastapi import status


@pytest.fixture
def auth_headers(client):
    # Login as test user
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@example.com", "password": "testpassword"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_upload_evidence_success(client, auth_headers):
    response = client.post(
        "/api/v1/evidence/upload",
        headers=auth_headers,
        json={
            "filename": "crime_scene.jpg",
            "file_type": "image/jpeg",
            "file_size": 102456,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["filename"] == "crime_scene.jpg"
    assert "id" in data
    assert "storage_path" in data
    assert "upload_url" in data


def test_upload_evidence_unauthorized(client):
    response = client.post(
        "/api/v1/evidence/upload",
        json={
            "filename": "crime_scene.jpg",
            "file_type": "image/jpeg",
            "file_size": 102456,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_evidence_success(client, auth_headers):
    # First upload
    upload_resp = client.post(
        "/api/v1/evidence/upload",
        headers=auth_headers,
        json={
            "filename": "doc.pdf",
            "file_type": "application/pdf",
            "file_size": 5000,
            "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    )
    evidence_id = upload_resp.json()["id"]

    # Get metadata
    get_resp = client.get(f"/api/v1/evidence/{evidence_id}", headers=auth_headers)
    assert get_resp.status_code == status.HTTP_200_OK
    data = get_resp.json()
    assert data["filename"] == "doc.pdf"
    assert data["file_type"] == "application/pdf"


def test_get_evidence_not_found(client, auth_headers):
    response = client.get(
        "/api/v1/evidence/00000000-0000-0000-0000-000000000000", headers=auth_headers
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
