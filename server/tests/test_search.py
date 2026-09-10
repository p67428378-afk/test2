def test_knowledge_base_search_and_tags(client, employee_headers, expert_headers):
    # 1. Create two notes
    note1_res = client.post(
        "/api/v1/notes",
        json={
            "title": "PostgreSQL Index Optimization",
            "body": "B-tree and GIN indexing strategies for full-text search.",
            "category": "Database",
            "tags": ["Database", "PostgreSQL"],
        },
        headers=employee_headers,
    )
    assert note1_res.status_code == 201
    note1_id = note1_res.json()["id"]

    note2_res = client.post(
        "/api/v1/notes",
        json={
            "title": "Unapproved Draft Note",
            "body": "This draft should not show in default search.",
            "tags": ["Database"],
        },
        headers=employee_headers,
    )
    assert note2_res.status_code == 201
    note2_id = note2_res.json()["id"]

    # Approve note1
    approve_res = client.post(
        f"/api/v1/reviews/{note1_id}/approve",
        json={"action": "APPROVE", "feedback": "Approved for KB"},
        headers=expert_headers,
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "APPROVED"

    # 2. Search default knowledge base (should return only approved note1)
    search_res = client.get("/api/v1/search?q=PostgreSQL")
    assert search_res.status_code == 200
    results = search_res.json()
    assert len(results) >= 1
    assert any(n["id"] == note1_id for n in results)
    assert not any(n["id"] == note2_id for n in results)

    # 3. Filter by tag
    tag_res = client.get("/api/v1/search?tag=PostgreSQL")
    assert tag_res.status_code == 200
    tag_results = tag_res.json()
    assert any(n["id"] == note1_id for n in tag_results)

    # 4. Get tags endpoint
    tags_res = client.get("/api/v1/tags")
    assert tags_res.status_code == 200
    all_tags = tags_res.json()
    assert len(all_tags) > 0
    tag_names = [t["name"] for t in all_tags]
    assert "PostgreSQL" in tag_names
