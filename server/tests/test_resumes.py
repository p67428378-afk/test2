import pytest
from datetime import date


@pytest.fixture
def sample_resume_payload():
    return {
        "title": "Software Engineer Resume",
        "full_name": "Alice Walker",
        "email": "alice.walker@example.com",
        "phone": "+1-555-0144",
        "summary": "Passionate Python and Cloud Engineer with 5+ years of experience.",
        "experiences": [
            {
                "company_name": "Tech Corp",
                "role": "Senior Developer",
                "start_date": "2021-01-01",
                "end_date": "2023-12-31",
                "is_current": False,
                "description": "Developed microservices and REST APIs in FastAPI.\nBuilt automated data pipelines."
            },
            {
                "company_name": "Startup Hub",
                "role": "Junior Developer",
                "start_date": "2019-06-01",
                "end_date": "2020-12-31",
                "is_current": False,
                "description": "Maintained web applications."
            }
        ],
        "education": [
            {
                "institution": "Tech Institute",
                "degree": "B.S. Computer Science",
                "start_date": "2015-09-01",
                "end_date": "2019-05-31"
            }
        ],
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Pytest"]
    }


def test_health_and_root(client):
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "ok"

    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "docs_url" in res_root.json()


def test_create_resume_success(client, sample_resume_payload):
    response = client.post("/api/v1/resumes", json=sample_resume_payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == "Software Engineer Resume"
    assert data["full_name"] == "Alice Walker"
    assert data["email"] == "alice.walker@example.com"
    assert len(data["experiences"]) == 2
    assert len(data["education"]) == 1
    assert "Python" in data["skills"]
    assert "FastAPI" in data["skills"]


def test_create_resume_invalid_dates_in_experience(client, sample_resume_payload):
    # End date before start date
    payload = dict(sample_resume_payload)
    payload["experiences"] = [
        {
            "company_name": "Invalid Date Corp",
            "role": "QA",
            "start_date": "2023-01-01",
            "end_date": "2022-01-01",
            "is_current": False,
            "description": "Invalid dates"
        }
    ]
    response = client.post("/api/v1/resumes", json=payload)
    assert response.status_code == 422


def test_create_resume_invalid_dates_in_education(client, sample_resume_payload):
    payload = dict(sample_resume_payload)
    payload["education"] = [
        {
            "institution": "Invalid College",
            "degree": "Diploma",
            "start_date": "2022-09-01",
            "end_date": "2020-05-31"
        }
    ]
    response = client.post("/api/v1/resumes", json=payload)
    assert response.status_code == 422


def test_create_resume_invalid_email(client, sample_resume_payload):
    payload = dict(sample_resume_payload)
    payload["email"] = "not-a-valid-email"
    response = client.post("/api/v1/resumes", json=payload)
    assert response.status_code == 422


def test_list_resumes_pagination(client, sample_resume_payload):
    # Create 3 resumes
    for i in range(3):
        payload = dict(sample_resume_payload)
        payload["title"] = f"Resume {i}"
        payload["email"] = f"user{i}@example.com"
        res = client.post("/api/v1/resumes", json=payload)
        assert res.status_code == 201

    res_all = client.get("/api/v1/resumes?skip=0&limit=10")
    assert res_all.status_code == 200
    resumes = res_all.json()
    assert len(resumes) >= 3

    res_paginated = client.get("/api/v1/resumes?skip=1&limit=1")
    assert res_paginated.status_code == 200
    assert len(res_paginated.json()) == 1


def test_get_resume_by_id(client, sample_resume_payload):
    created = client.post("/api/v1/resumes", json=sample_resume_payload).json()
    resume_id = created["id"]

    response = client.get(f"/api/v1/resumes/{resume_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == resume_id
    assert data["full_name"] == sample_resume_payload["full_name"]


def test_get_resume_not_found(client):
    response = client.get("/api/v1/resumes/non-existent-uuid")
    assert response.status_code == 404
    assert "detail" in response.json()


def test_update_resume_success(client, sample_resume_payload):
    created = client.post("/api/v1/resumes", json=sample_resume_payload).json()
    resume_id = created["id"]

    update_payload = {
        "title": "Principal Architect Resume",
        "summary": "Updated executive summary.",
        "skills": ["Architecture", "Python", "Kubernetes"],
        "experiences": [
            {
                "company_name": "New Corp",
                "role": "Principal Architect",
                "start_date": "2024-01-01",
                "is_current": True,
                "description": "Leading cloud transition."
            }
        ]
    }
    response = client.put(f"/api/v1/resumes/{resume_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Principal Architect Resume"
    assert data["summary"] == "Updated executive summary."
    assert len(data["experiences"]) == 1
    assert data["experiences"][0]["company_name"] == "New Corp"
    assert "Kubernetes" in data["skills"]


def test_update_resume_invalid_dates(client, sample_resume_payload):
    created = client.post("/api/v1/resumes", json=sample_resume_payload).json()
    resume_id = created["id"]

    update_payload = {
        "experiences": [
            {
                "company_name": "Error Corp",
                "role": "Tester",
                "start_date": "2023-01-01",
                "end_date": "2021-01-01"
            }
        ]
    }
    response = client.put(f"/api/v1/resumes/{resume_id}", json=update_payload)
    assert response.status_code == 422


def test_update_resume_not_found(client):
    response = client.put("/api/v1/resumes/non-existent-id", json={"title": "Test"})
    assert response.status_code == 404


def test_delete_resume_success(client, sample_resume_payload):
    created = client.post("/api/v1/resumes", json=sample_resume_payload).json()
    resume_id = created["id"]

    # Delete
    del_res = client.delete(f"/api/v1/resumes/{resume_id}")
    assert del_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/v1/resumes/{resume_id}")
    assert get_res.status_code == 404


def test_delete_resume_not_found(client):
    del_res = client.delete("/api/v1/resumes/non-existent-id")
    assert del_res.status_code == 404


def test_export_pdf_success(client, sample_resume_payload):
    created = client.post("/api/v1/resumes", json=sample_resume_payload).json()
    resume_id = created["id"]

    response = client.get(f"/api/v1/resumes/{resume_id}/export")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert f'filename="Resume_{resume_id}.pdf"' in response.headers["content-disposition"]
    # PDF magic byte signature check
    assert response.content.startswith(b"%PDF")
    assert len(response.content) > 500


def test_export_pdf_not_found(client):
    response = client.get("/api/v1/resumes/non-existent-id/export")
    assert response.status_code == 404


def test_export_pdf_with_special_characters_and_long_text(client):
    payload = {
        "title": "C++ & Python Developer <Senior> \"Lead\"",
        "full_name": "Renée & François O'Connor",
        "email": "renee.oconnor+test@example.com",
        "phone": "+33 (0)1 23 45 67 89",
        "summary": "Expert in <systems> & cloud architectures with 10+ years experience. Handled & resolved 500+ issues > 99.9% uptime. Multi-paragraph summary with special characters: & < > \" ' € £ ¥.",
        "experiences": [
            {
                "company_name": "R&D Solutions & Co.",
                "role": "Lead Architect & Staff Eng.",
                "start_date": "2020-01-01",
                "end_date": "2023-12-31",
                "is_current": False,
                "description": "- Led team of 15+ engineers developing high-load streaming systems.\n- Handled data throughput > 100k msg/sec & ensured zero-loss recovery.\n- Bullet point with <b>HTML-like</b> tags & ampersands."
            }
        ],
        "education": [
            {
                "institution": "École Polytechnique & University of Paris",
                "degree": "M.S. in Computer Science & Engineering",
                "start_date": "2014-09-01",
                "end_date": "2016-06-30"
            }
        ],
        "skills": ["C++", "Python", "TCP/IP & Sockets", "Docker & K8s", "CI/CD & DevOps"]
    }
    created = client.post("/api/v1/resumes", json=payload).json()
    resume_id = created["id"]

    response = client.get(f"/api/v1/resumes/{resume_id}/export")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF")
