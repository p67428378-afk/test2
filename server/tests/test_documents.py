"""
Module: server.tests.test_documents
Purpose: Tests for document upload functionality.
"""

import io
from fastapi import status
from server.tests.test_products import get_auth_headers


def test_upload_document_success(client):
    # AC: Users can upload proof of purchase or receipt documents
    headers = get_auth_headers(client, "upload@example.com")

    # Create a mock file
    file_content = b"mock receipt content"
    file_name = "receipt.pdf"

    response = client.post(
        "/api/v1/documents/upload",
        files={"file": (file_name, io.BytesIO(file_content), "application/pdf")},
        headers=headers,
    )

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["filename"] == "receipt.pdf"
    assert "id" in data
    assert "file_url" in data
