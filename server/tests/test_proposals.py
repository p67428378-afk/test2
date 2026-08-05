import io
from fastapi import status


def test_create_proposal_success(client, auth_headers):
    headers = auth_headers("test@example.com")
    payload = {
        "title": "Quantum AI Research",
        "abstract": "Investigating quantum machine learning algorithms.",
        "requested_budget": 120000.00,
        "co_investigators": "Dr. Smith, Dr. Doe",
        "department": "Computer Science",
    }
    response = client.post("/api/v1/proposals", json=payload, headers=headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "DRAFT"
    assert (
        data["requested_budget"] == "120000.00" or data["requested_budget"] == 120000.0
    )


def test_create_proposal_exceed_budget(client, auth_headers):
    headers = auth_headers("test@example.com")
    payload = {
        "title": "Overbudget Research",
        "abstract": "Exceeding grant cap.",
        "requested_budget": 200000.00,
    }
    response = client.post("/api/v1/proposals", json=payload, headers=headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "exceeds maximum limit" in response.json()["detail"]


def test_list_proposals(client, auth_headers):
    headers = auth_headers("test@example.com")
    # Create proposal first
    client.post(
        "/api/v1/proposals",
        json={
            "title": "Proposal 1",
            "abstract": "Abstract 1",
            "requested_budget": 50000.0,
        },
        headers=headers,
    )

    response = client.get("/api/v1/proposals", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1


def test_upload_document_success(client, auth_headers):
    headers = auth_headers("test@example.com")
    create_res = client.post(
        "/api/v1/proposals",
        json={
            "title": "Proposal Doc Test",
            "abstract": "Abstract Doc",
            "requested_budget": 30000.0,
        },
        headers=headers,
    )
    proposal_id = create_res.json()["id"]

    file_content = b"PDF dummy methodology content"
    files = {"file": ("methodology.pdf", io.BytesIO(file_content), "application/pdf")}

    response = client.post(
        f"/api/v1/proposals/{proposal_id}/documents",
        files=files,
        headers=headers,
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["document_url"] is not None
