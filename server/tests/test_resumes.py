import pytest


SAMPLE_RESUME_PAYLOAD = {
    "user_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1-555-0199",
    "portfolio_url": "https://linkedin.com/in/janedoe",
    "template_id": "modern",
    "experiences": [
        {
            "company": "Tech Corp",
            "role": "Software Engineer",
            "start_date": "2022-01",
            "end_date": "Present",
            "bullet_points": [
                "Architected scalable microservices handling 10k RPS",
                "Optimized SQL queries reducing latency by 35%"
            ]
        }
    ],
    "education": [
        {
            "institution": "State University",
            "degree": "B.S. Computer Science",
            "completion_year": "2021"
        }
    ],
    "skills": ["Python", "FastAPI", "React", "Tailwind CSS", "PostgreSQL"]
}


def test_health_check(client):
    """Verify health check endpoint returns 200 OK."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Quick Resume Maker" in data["service"]


def test_list_templates(client):
    """Verify listing available resume templates."""
    response = client.get("/api/v1/templates")
    assert response.status_code == 200
    templates = response.json()
    assert len(templates) >= 2
    template_ids = [t["id"] for t in templates]
    assert "classic" in template_ids
    assert "modern" in template_ids


def test_create_resume_success(client):
    """Verify creating a valid resume record."""
    response = client.post("/api/v1/resumes", json=SAMPLE_RESUME_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["user_name"] == "Jane Doe"
    assert data["email"] == "jane.doe@example.com"
    assert len(data["experiences"]) == 1
    assert data["experiences"][0]["company"] == "Tech Corp"
    assert len(data["education"]) == 1
    assert data["education"][0]["degree"] == "B.S. Computer Science"
    assert "Python" in data["skills"]


def test_create_resume_invalid_email(client):
    """Verify creating a resume with malformed email fails with 400 Bad Request."""
    invalid_payload = dict(SAMPLE_RESUME_PAYLOAD)
    invalid_payload["email"] = "invalid-email-no-domain"
    response = client.post("/api/v1/resumes", json=invalid_payload)
    assert response.status_code == 400
    assert "Invalid email" in response.json()["detail"]


def test_get_resume_by_id(client):
    """Verify fetching a specific resume by UUID."""
    create_res = client.post("/api/v1/resumes", json=SAMPLE_RESUME_PAYLOAD)
    assert create_res.status_code == 201
    resume_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/resumes/{resume_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["id"] == resume_id
    assert data["user_name"] == "Jane Doe"


def test_get_resume_not_found(client):
    """Verify requesting non-existent resume returns 404."""
    response = client.get("/api/v1/resumes/non-existent-uuid-123")
    assert response.status_code == 404
    assert "Resume with specified ID not found" in response.json()["detail"]


def test_list_resumes_pagination(client):
    """Verify listing resumes with pagination."""
    # Create two resumes
    payload1 = dict(SAMPLE_RESUME_PAYLOAD, user_name="Alice Smith", email="alice@example.com")
    payload2 = dict(SAMPLE_RESUME_PAYLOAD, user_name="Bob Jones", email="bob@example.com")
    client.post("/api/v1/resumes", json=payload1)
    client.post("/api/v1/resumes", json=payload2)

    response = client.get("/api/v1/resumes?skip=0&limit=10")
    assert response.status_code == 200
    resumes = response.json()
    assert isinstance(resumes, list)
    assert len(resumes) >= 2


def test_update_resume(client):
    """Verify updating resume fields."""
    create_res = client.post("/api/v1/resumes", json=SAMPLE_RESUME_PAYLOAD)
    resume_id = create_res.json()["id"]

    update_payload = {
        "user_name": "Jane Updated",
        "skills": ["Python", "Go", "Kubernetes"]
    }
    update_res = client.put(f"/api/v1/resumes/{resume_id}", json=update_payload)
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["user_name"] == "Jane Updated"
    assert "Kubernetes" in updated_data["skills"]


def test_update_resume_not_found(client):
    """Verify updating a non-existent resume returns 404."""
    response = client.put("/api/v1/resumes/non-existent-uuid-123", json={"user_name": "Ghost"})
    assert response.status_code == 404


def test_delete_resume(client):
    """Verify deleting a resume."""
    create_res = client.post("/api/v1/resumes", json=SAMPLE_RESUME_PAYLOAD)
    resume_id = create_res.json()["id"]

    delete_res = client.delete(f"/api/v1/resumes/{resume_id}")
    assert delete_res.status_code == 204

    # Verify subsequent fetch returns 404
    get_res = client.get(f"/api/v1/resumes/{resume_id}")
    assert get_res.status_code == 404


def test_delete_resume_not_found(client):
    """Verify deleting non-existent resume returns 404."""
    response = client.delete("/api/v1/resumes/non-existent-uuid-123")
    assert response.status_code == 404


def test_export_pdf_direct_payload_classic(client):
    """Verify on-the-fly PDF export with classic template."""
    export_payload = dict(SAMPLE_RESUME_PAYLOAD, template_id="classic")
    response = client.post("/api/v1/resumes/export-pdf", json=export_payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert 'filename="Jane_Doe_Resume.pdf"' in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-")


def test_export_pdf_direct_payload_modern(client):
    """Verify on-the-fly PDF export with modern template."""
    export_payload = dict(SAMPLE_RESUME_PAYLOAD, template_id="modern")
    response = client.post("/api/v1/resumes/export-pdf", json=export_payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert 'filename="Jane_Doe_Resume.pdf"' in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-")


def test_export_pdf_by_resume_id(client):
    """Verify exporting PDF by referencing existing resume_id in DB."""
    create_res = client.post("/api/v1/resumes", json=SAMPLE_RESUME_PAYLOAD)
    resume_id = create_res.json()["id"]

    response = client.post("/api/v1/resumes/export-pdf", json={"resume_id": resume_id})
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert 'filename="Jane_Doe_Resume.pdf"' in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-")


def test_export_pdf_by_invalid_resume_id(client):
    """Verify exporting PDF with unknown resume_id returns 404."""
    response = client.post("/api/v1/resumes/export-pdf", json={"resume_id": "non-existent-uuid-456"})
    assert response.status_code == 404
    assert "Resume with specified ID not found" in response.json()["detail"]


def test_export_pdf_missing_required_fields(client):
    """Verify exporting on-the-fly without name or email returns 422."""
    response = client.post("/api/v1/resumes/export-pdf", json={"skills": ["Python"]})
    assert response.status_code == 422
    assert "required" in response.json()["detail"].lower()
