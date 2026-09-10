def test_expert_approval_workflow(client, employee_headers, expert_headers):
    # 1. Create a note as employee
    create_payload = {
        "title": "Async Architecture in Python",
        "body": "Analysis of FastAPI and AsyncIO for high concurrency microservices.",
        "category": "Architecture",
        "tags": ["FastAPI", "Async"],
    }
    create_res = client.post(
        "/api/v1/notes", json=create_payload, headers=employee_headers
    )
    assert create_res.status_code == 201
    note_id = create_res.json()["id"]

    # 2. Check pending queue as expert
    queue_res = client.get("/api/v1/reviews/pending", headers=expert_headers)
    assert queue_res.status_code == 200
    pending_notes = queue_res.json()
    assert any(n["id"] == note_id for n in pending_notes)

    # 3. Approve note as expert
    approve_res = client.post(
        f"/api/v1/reviews/{note_id}/approve",
        json={
            "action": "APPROVE",
            "feedback": "Approved - valuable architectural insights.",
        },
        headers=expert_headers,
    )
    assert approve_res.status_code == 200
    approved_data = approve_res.json()
    assert approved_data["status"] == "APPROVED"

    # Verify review history
    history_res = client.get(f"/api/v1/reviews/notes/{note_id}")
    assert history_res.status_code == 200
    history = history_res.json()
    assert len(history) == 1
    assert history[0]["action"] == "APPROVE"


def test_expert_rejection_workflow(client, employee_headers, expert_headers):
    # 1. Create a note
    create_res = client.post(
        "/api/v1/notes",
        json={
            "title": "Flawed Research Note",
            "body": "Incomplete research with invalid claims.",
        },
        headers=employee_headers,
    )
    assert create_res.status_code == 201
    note_id = create_res.json()["id"]

    # 2. Reject without feedback should fail with 400
    reject_no_feedback = client.post(
        f"/api/v1/reviews/{note_id}/reject",
        json={"action": "REJECT", "feedback": ""},
        headers=expert_headers,
    )
    assert reject_no_feedback.status_code == 400
    assert "feedback" in reject_no_feedback.json()["detail"].lower()

    # 3. Reject with mandatory feedback
    reject_res = client.post(
        f"/api/v1/reviews/{note_id}/reject",
        json={
            "action": "REJECT",
            "feedback": "Rejected: Missing benchmark data and code samples.",
        },
        headers=expert_headers,
    )
    assert reject_res.status_code == 200
    rejected_data = reject_res.json()
    assert rejected_data["status"] == "REJECTED"


def test_employee_cannot_review(client, employee_headers):
    # Create note
    create_res = client.post(
        "/api/v1/notes",
        json={"title": "Test Note", "body": "Content body"},
        headers=employee_headers,
    )
    note_id = create_res.json()["id"]

    # Employee attempting expert approval should get 403
    approve_res = client.post(
        f"/api/v1/reviews/{note_id}/approve",
        json={"action": "APPROVE"},
        headers=employee_headers,
    )
    assert approve_res.status_code == 403
