def test_create_and_get_note(client, employee_headers):
    payload = {
        "title": "Distributed Cache Benchmarks",
        "body": "Detailed benchmark results comparing Redis vs Memcached under high throughput.",
        "category": "Performance",
        "tags": ["Redis", "Performance", "Caching"],
        "citations": [
            {
                "title": "Internal Benchmark Document",
                "url": "https://bfsi-na-ai-engineering-v4.atlassian.net/wiki/spaces/SCRUM2/pages/12345",
                "citation_type": "CONFLUENCE",
            },
            {
                "title": "Redis Official Benchmarks",
                "url": "https://redis.io/topics/benchmarks",
                "citation_type": "EXTERNAL",
            },
        ],
    }

    # 1. Create note
    response = client.post("/api/v1/notes", json=payload, headers=employee_headers)
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["body"] == payload["body"]
    assert data["status"] == "PENDING"
    assert len(data["tags"]) == 3
    assert len(data["citations"]) == 2
    note_id = data["id"]

    # 2. Get list of notes
    list_res = client.get("/api/v1/notes")
    assert list_res.status_code == 200
    notes = list_res.json()
    assert any(n["id"] == note_id for n in notes)

    # 3. Get note detail
    detail_res = client.get(f"/api/v1/notes/{note_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["id"] == note_id
    assert detail_data["title"] == payload["title"]


def test_get_nonexistent_note(client):
    response = client.get("/api/v1/notes/invalid-note-uuid-999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
