from starlette.testclient import TestClient


SAMPLE_PAYLOAD = {
    "user_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1 (555) 019-2834",
    "portfolio_url": "https://janedoe.dev",
    "template_id": "modern",
    "experiences": [
        {
            "company": "Acme Innovations",
            "role": "Senior Full-Stack Engineer",
            "start_date": "Jan 2021",
            "end_date": "Present",
            "description": "Led architecture of core microservices platform.",
            "bullets": [
                "Boosted API performance by 40% using async FastAPI workers.",
                "Mentored 5 junior engineers and standardized CI/CD pipelines.",
            ],
        }
    ],
    "education": [
        {
            "institution": "University of Technology",
            "degree": "B.S.",
            "field_of_study": "Computer Science",
            "start_date": "2016",
            "end_date": "2020",
            "grade": "3.9 GPA",
        }
    ],
    "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Tailwind CSS"],
}


def test_health_check(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_templates(client: TestClient):
    response = client.get("/api/v1/templates")
    assert response.status_code == 200
    templates = response.json()
    assert isinstance(templates, list)
    assert len(templates) >= 2
    template_ids = [t["id"] for t in templates]
    assert "classic" in template_ids
    assert "modern" in template_ids


def test_create_and_get_resume(client: TestClient):
    # 1. Create resume
    create_resp = client.post("/api/v1/resumes", json=SAMPLE_PAYLOAD)
    assert create_resp.status_code == 201
    created_data = create_resp.json()
    assert created_data["user_name"] == "Jane Doe"
    assert created_data["email"] == "jane.doe@example.com"
    assert created_data["template_id"] == "modern"
    assert "id" in created_data
    resume_id = created_data["id"]

    # 2. Get resume by ID
    get_resp = client.get(f"/api/v1/resumes/{resume_id}")
    assert get_resp.status_code == 200
    fetched_data = get_resp.json()
    assert fetched_data["id"] == resume_id
    assert fetched_data["user_name"] == "Jane Doe"
    assert len(fetched_data["experiences"]) == 1


def test_list_resumes_pagination(client: TestClient):
    # Create 2 resumes
    client.post("/api/v1/resumes", json=SAMPLE_PAYLOAD)
    p2 = dict(SAMPLE_PAYLOAD, user_name="Alex Smith", email="alex@example.com")
    client.post("/api/v1/resumes", json=p2)

    response = client.get("/api/v1/resumes?skip=0&limit=10")
    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    assert len(items) >= 2


def test_update_resume(client: TestClient):
    create_resp = client.post("/api/v1/resumes", json=SAMPLE_PAYLOAD)
    resume_id = create_resp.json()["id"]

    update_payload = {
        "user_name": "Jane Smith",
        "template_id": "executive",
    }
    update_resp = client.put(f"/api/v1/resumes/{resume_id}", json=update_payload)
    assert update_resp.status_code == 200
    updated = update_resp.json()
    assert updated["user_name"] == "Jane Smith"
    assert updated["template_id"] == "executive"
    assert updated["email"] == "jane.doe@example.com"


def test_delete_resume(client: TestClient):
    create_resp = client.post("/api/v1/resumes", json=SAMPLE_PAYLOAD)
    resume_id = create_resp.json()["id"]

    del_resp = client.delete(f"/api/v1/resumes/{resume_id}")
    assert del_resp.status_code == 204

    get_resp = client.get(f"/api/v1/resumes/{resume_id}")
    assert get_resp.status_code == 404


def test_resume_not_found(client: TestClient):
    response = client.get("/api/v1/resumes/non-existent-id")
    assert response.status_code == 404


def test_export_pdf_success(client: TestClient):
    payload = dict(SAMPLE_PAYLOAD, user_name="Jane Doe")
    response = client.post("/api/v1/resumes/export-pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "Jane_Doe_Resume.pdf" in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF")


def test_export_pdf_different_templates(client: TestClient):
    for t_id in ["classic", "modern", "executive", "creative", "minimalist"]:
        payload = dict(SAMPLE_PAYLOAD, template_id=t_id, user_name=f"User {t_id}")
        response = client.post("/api/v1/resumes/export-pdf", json=payload)
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"
        assert response.content.startswith(b"%PDF")
