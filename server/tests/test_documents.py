import uuid
from server.database import init_db, seed_data


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "Browser Markdown Editor API" in response.json()["message"]


def test_create_document_success(client):
    payload = {
        "title": "My Test Document",
        "content": "# Test Header\n\nThis is **bold** text.",
    }
    response = client.post("/api/v1/documents", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["content"] == payload["content"]
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_document_validation_errors(client):
    # Missing title
    response = client.post("/api/v1/documents", json={"content": "Some text"})
    assert response.status_code == 422

    # Empty title
    response = client.post(
        "/api/v1/documents", json={"title": "", "content": "Some text"}
    )
    assert response.status_code == 422


def test_list_documents(client):
    # Create two documents
    doc1 = client.post(
        "/api/v1/documents",
        json={"title": "Doc 1", "content": "Content 1"},
    ).json()
    doc2 = client.post(
        "/api/v1/documents",
        json={"title": "Doc 2", "content": "Content 2"},
    ).json()

    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    docs = response.json()
    assert isinstance(docs, list)
    ids = [d["id"] for d in docs]
    assert doc1["id"] in ids
    assert doc2["id"] in ids


def test_list_documents_pagination(client):
    # Create several documents
    for i in range(5):
        client.post(
            "/api/v1/documents",
            json={"title": f"Page Doc {i}", "content": f"Content {i}"},
        )

    response = client.get("/api/v1/documents?skip=0&limit=2")
    assert response.status_code == 200
    docs = response.json()
    assert len(docs) == 2


def test_get_document_by_id_success(client):
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Lookup Doc", "content": "Lookup Content"},
    )
    doc_id = create_res.json()["id"]

    response = client.get(f"/api/v1/documents/{doc_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == doc_id
    assert data["title"] == "Lookup Doc"
    assert data["content"] == "Lookup Content"


def test_get_document_not_found(client):
    non_existent_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/documents/{non_existent_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_get_document_invalid_uuid(client):
    response = client.get("/api/v1/documents/not-a-valid-uuid")
    assert response.status_code == 422


def test_update_document_success(client):
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Original Title", "content": "Original Content"},
    )
    doc_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/v1/documents/{doc_id}",
        json={"title": "Updated Title", "content": "Updated Content"},
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "Updated Content"


def test_update_document_partial(client):
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "Partial Title", "content": "Partial Content"},
    )
    doc_id = create_res.json()["id"]

    # Update only title
    update_res = client.put(
        f"/api/v1/documents/{doc_id}",
        json={"title": "New Title Only"},
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["title"] == "New Title Only"
    assert data["content"] == "Partial Content"


def test_update_document_not_found(client):
    non_existent_id = str(uuid.uuid4())
    response = client.put(
        f"/api/v1/documents/{non_existent_id}",
        json={"title": "Does not matter"},
    )
    assert response.status_code == 404


def test_delete_document_success(client):
    create_res = client.post(
        "/api/v1/documents",
        json={"title": "To Delete", "content": "Content to delete"},
    )
    doc_id = create_res.json()["id"]

    delete_res = client.delete(f"/api/v1/documents/{doc_id}")
    assert delete_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/v1/documents/{doc_id}")
    assert get_res.status_code == 404


def test_delete_document_not_found(client):
    non_existent_id = str(uuid.uuid4())
    response = client.delete(f"/api/v1/documents/{non_existent_id}")
    assert response.status_code == 404


def test_seed_and_init_idempotency(db_session):
    # Running init_db and seed_data multiple times should not raise errors
    init_db()
    seed_data(db_session)
    # Call again to verify idempotency
    seed_data(db_session)
