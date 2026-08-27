"""Unit and integration tests for Document REST API."""

import uuid


def test_create_document_success(client):
    """Test creating a document with title and markdown content."""
    payload = {
        "title": "Meeting Notes",
        "content": "# Sprint Planning\n- Item 1\n- Item 2",
    }
    response = client.post("/api/v1/documents", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == "Meeting Notes"
    assert data["content"] == "# Sprint Planning\n- Item 1\n- Item 2"
    assert "created_at" in data
    assert "updated_at" in data


def test_create_document_default_title(client):
    """Test creating a document without specifying a title uses default."""
    payload = {
        "content": "## Quick Draft\nJust some notes.",
    }
    response = client.post("/api/v1/documents", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Untitled Document"
    assert data["content"] == "## Quick Draft\nJust some notes."


def test_create_document_exceeds_size_limit(client):
    """Test that creating a document over 5MB returns 400 Bad Request."""
    # 5MB + 10 bytes
    large_content = "a" * (5 * 1024 * 1024 + 10)
    payload = {
        "title": "Huge Document",
        "content": large_content,
    }
    response = client.post("/api/v1/documents", json=payload)
    assert response.status_code == 400
    assert "exceeds maximum allowed size" in response.json()["detail"]


def test_get_document_by_id_success(client):
    """Test fetching an existing document by its ID."""
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Doc to Fetch", "content": "Fetchable content"},
    )
    doc_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/documents/{doc_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["id"] == doc_id
    assert data["title"] == "Doc to Fetch"
    assert data["content"] == "Fetchable content"


def test_get_document_not_found(client):
    """Test fetching a non-existent document returns 404."""
    non_existent_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/documents/{non_existent_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_update_document_success(client):
    """Test updating both title and content of an existing document."""
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Initial Title", "content": "Initial Content"},
    )
    doc_id = create_res.json()["id"]

    update_payload = {
        "title": "Updated Title",
        "content": "Updated Markdown Content with **bold** text",
    }
    update_res = client.put(f"/api/v1/documents/{doc_id}", json=update_payload)
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["id"] == doc_id
    assert data["title"] == "Updated Title"
    assert data["content"] == "Updated Markdown Content with **bold** text"


def test_update_document_partial(client):
    """Test updating only title or only content."""
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Original Title", "content": "Original Content"},
    )
    doc_id = create_res.json()["id"]

    # Update only title
    res1 = client.put(f"/api/v1/documents/{doc_id}", json={"title": "New Title Only"})
    assert res1.status_code == 200
    assert res1.json()["title"] == "New Title Only"
    assert res1.json()["content"] == "Original Content"

    # Update only content
    res2 = client.put(f"/api/v1/documents/{doc_id}", json={"content": "New Content Only"})
    assert res2.status_code == 200
    assert res2.json()["title"] == "New Title Only"
    assert res2.json()["content"] == "New Content Only"


def test_update_document_exceeds_size_limit(client):
    """Test that updating a document with content over 5MB returns 400."""
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Doc for Big Update", "content": "Small content"},
    )
    doc_id = create_res.json()["id"]

    large_content = "x" * (5 * 1024 * 1024 + 10)
    update_res = client.put(
        f"/api/v1/documents/{doc_id}",
        json={"content": large_content},
    )
    assert update_res.status_code == 400
    assert "exceeds maximum allowed size" in update_res.json()["detail"]


def test_update_document_not_found(client):
    """Test updating a non-existent document returns 404."""
    non_existent_id = str(uuid.uuid4())
    response = client.put(
        f"/api/v1/documents/{non_existent_id}",
        json={"title": "Ghost Doc"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_list_documents_pagination(client):
    """Test listing documents with pagination."""
    # Create several documents
    for i in range(5):
        client.post(
            "/api/v1/documents",
            json={"title": f"Doc {i}", "content": f"Content for doc {i}"},
        )

    # Get page 1
    res = client.get("/api/v1/documents?skip=0&limit=3")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 5
    assert data["skip"] == 0
    assert data["limit"] == 3
    assert len(data["items"]) == 3

    # Get page 2
    res2 = client.get("/api/v1/documents?skip=3&limit=3")
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["skip"] == 3
    assert len(data2["items"]) >= 2


def test_delete_document_success(client):
    """Test deleting an existing document returns 204."""
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "To be deleted", "content": "Will be gone"},
    )
    doc_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/documents/{doc_id}")
    assert del_res.status_code == 204

    # Verify document is gone
    get_res = client.get(f"/api/v1/documents/{doc_id}")
    assert get_res.status_code == 404


def test_delete_document_not_found(client):
    """Test deleting a non-existent document returns 404."""
    non_existent_id = str(uuid.uuid4())
    response = client.delete(f"/api/v1/documents/{non_existent_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_health_and_root_endpoints(client):
    """Test system health check and root endpoints."""
    health_res = client.get("/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"

    root_res = client.get("/")
    assert root_res.status_code == 200
    assert "Browser Markdown Editor" in root_res.json()["message"]
