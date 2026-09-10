from unittest.mock import patch

from fastapi.testclient import TestClient


def test_health_and_root_endpoints(client: TestClient):
    # Base health & root checks
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

    resp2 = client.get("/")
    assert resp2.status_code == 200
    assert "version" in resp2.json()


def test_classify_json_text_entry(client: TestClient):
    # AC: Email Input Options: direct text entry
    # AC: AI Classification Engine: Categorize and return confidence score
    payload = {
        "text": "Urgent: Server Downtime Alert. The production database is experiencing high latency.",
        "subject": "Urgent: Server Downtime Alert",
        "sender": "alerts@monitoring.local",
    }
    response = client.post("/api/v1/emails/classify", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["subject"] == "Urgent: Server Downtime Alert"
    assert data["sender"] == "alerts@monitoring.local"
    assert data["source_type"] == "TEXT_ENTRY"
    assert data["classification"]["primary_category"] == "Urgent"
    assert data["classification"]["confidence_score"] > 80.0
    assert data["classification"]["is_overridden"] is False


def test_classify_eml_file_upload(client: TestClient):
    # AC: Email Input Options: upload standard .eml format
    eml_content = (
        b"From: marketing@megadeals.com\r\n"
        b"Subject: Big Summer Sale 40% Off Everything!\r\n"
        b"Content-Type: text/plain; charset=utf-8\r\n\r\n"
        b"Shop now and use coupon code SUMMER40 for huge discounts and free shipping on all orders."
    )
    files = {"file": ("summer_promo.eml", eml_content, "message/rfc822")}
    response = client.post("/api/v1/emails/classify", files=files)
    assert response.status_code == 201
    data = response.json()
    assert data["source_type"] == "FILE_UPLOAD"
    assert data["file_name"] == "summer_promo.eml"
    assert data["classification"]["primary_category"] == "Promotional"


def test_classify_txt_file_upload(client: TestClient):
    # AC: Email Input Options: upload .txt file
    txt_content = (
        b"From: team-lead@company.internal\n"
        b"Subject: Sprint Review Agenda and Release Notes\n\n"
        b"Please find the agenda for our upcoming sprint retrospective and Q3 milestone review."
    )
    files = {"file": ("sprint_notes.txt", txt_content, "text/plain")}
    response = client.post("/api/v1/emails/classify", files=files)
    assert response.status_code == 201
    data = response.json()
    assert data["source_type"] == "FILE_UPLOAD"
    assert data["classification"]["primary_category"] == "Work"


def test_classify_unsupported_file_format_returns_400(client: TestClient):
    # AC: Edge Cases & Error Handling: Invalid file upload triggers 400 error
    files = {
        "file": ("malicious_payload.exe", b"MZ\x90\x00", "application/octet-stream")
    }
    response = client.post("/api/v1/emails/classify", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_classify_empty_payload_returns_422(client: TestClient):
    # AC: Edge Cases: Empty text validation
    response = client.post("/api/v1/emails/classify", json={"text": "   "})
    assert response.status_code == 422


def test_classify_ai_timeout_returns_504(client: TestClient):
    # AC: Edge Cases & Error Handling: AI service timeouts return 504 Gateway Timeout
    with patch("server.app.api.v1.emails.classify_email_async") as mock_async_classify:
        mock_async_classify.side_effect = TimeoutError("Service timed out")
        response = client.post(
            "/api/v1/emails/classify",
            json={"text": "Sample text", "subject": "Test"},
        )
        assert response.status_code == 504
        assert "timed out" in response.json()["detail"]


def test_get_emails_pagination_and_sorting(client: TestClient):
    # AC: User Review & Verification Interface: View dashboard/list of classified emails
    # Seed two emails
    client.post(
        "/api/v1/emails/classify",
        json={"text": "Quarterly sprint goals", "subject": "Sprint Goals"},
    )
    client.post(
        "/api/v1/emails/classify",
        json={"text": "Family weekend birthday trip", "subject": "Birthday Weekend"},
    )

    response = client.get("/api/v1/emails?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    assert len(data["items"]) >= 2
    assert "classification" in data["items"][0]
    assert "excerpt" in data["items"][0]


def test_get_emails_filtering_by_category(client: TestClient):
    # AC: Filtering & Search: Filter by category (Work, Personal, Urgent, Promotional)
    client.post(
        "/api/v1/emails/classify",
        json={
            "text": "URGENT P0: Database downtime alert immediately",
            "subject": "P0 Alert",
        },
    )
    client.post(
        "/api/v1/emails/classify",
        json={"text": "Huge discounts 70% off coupon code", "subject": "Sale Alert"},
    )

    resp_urgent = client.get("/api/v1/emails?category=Urgent")
    assert resp_urgent.status_code == 200
    urgent_items = resp_urgent.json()["items"]
    assert len(urgent_items) >= 1
    assert all(
        item["classification"]["primary_category"] == "Urgent" for item in urgent_items
    )


def test_get_emails_search_query(client: TestClient):
    # AC: Filtering & Search: Keyword search across email subjects and content
    client.post(
        "/api/v1/emails/classify",
        json={
            "text": "Special architecture document review",
            "subject": "Alpha Project",
        },
    )

    response = client.get("/api/v1/emails?search=Alpha")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("Alpha" in item["subject"] for item in data["items"])


def test_get_email_detail_and_not_found(client: TestClient):
    # AC: User Review: Get single email details
    create_resp = client.post(
        "/api/v1/emails/classify",
        json={"text": "Project roadmap sync meeting", "subject": "Roadmap Sync"},
    )
    email_id = create_resp.json()["id"]

    detail_resp = client.get(f"/api/v1/emails/{email_id}")
    assert detail_resp.status_code == 200
    assert detail_resp.json()["id"] == email_id

    notFound = client.get("/api/v1/emails/non-existent-uuid")
    assert notFound.status_code == 404


def test_override_email_classification(client: TestClient):
    # AC: User Review & Verification Interface: Manual category override
    create_resp = client.post(
        "/api/v1/emails/classify",
        json={"text": "Casual catchup over coffee", "subject": "Coffee Sync"},
    )
    email_id = create_resp.json()["id"]
    original_category = create_resp.json()["classification"]["primary_category"]

    override_resp = client.patch(
        f"/api/v1/emails/{email_id}",
        json={"category": "Work"},
    )
    assert override_resp.status_code == 200
    data = override_resp.json()
    assert data["classification"]["primary_category"] == "Work"
    assert data["classification"]["user_override_category"] == "Work"
    assert data["classification"]["is_overridden"] is True

    # Check that filtering reflects the overridden category
    filter_resp = client.get("/api/v1/emails?category=Work")
    assert any(item["id"] == email_id for item in filter_resp.json()["items"])


def test_override_invalid_category_returns_400(client: TestClient):
    # AC: Edge cases: invalid category override rejected
    create_resp = client.post(
        "/api/v1/emails/classify",
        json={"text": "Test email content", "subject": "Test"},
    )
    email_id = create_resp.json()["id"]

    override_resp = client.patch(
        f"/api/v1/emails/{email_id}",
        json={"category": "InvalidCategoryName"},
    )
    assert override_resp.status_code == 400
    assert "Invalid category" in override_resp.json()["detail"]


def test_delete_email(client: TestClient):
    # AC: Delete email endpoint
    create_resp = client.post(
        "/api/v1/emails/classify",
        json={"text": "Email to be deleted", "subject": "Delete Me"},
    )
    email_id = create_resp.json()["id"]

    del_resp = client.delete(f"/api/v1/emails/{email_id}")
    assert del_resp.status_code == 204

    get_resp = client.get(f"/api/v1/emails/{email_id}")
    assert get_resp.status_code == 404
