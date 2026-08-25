import io

def test_apply_for_job(client):
    # AC: Job seekers can apply for open roles by uploading a resume (PDF format, max 5MB) and providing a cover letter
    # Register employer and create a job
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer_app@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    emp_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer_app@example.com",
            "password": "password123"
        }
    )
    emp_token = emp_login.json()["access_token"]

    job_resp = client.post(
        "/api/v1/jobs",
        json={
            "title": "FastAPI Developer",
            "description": "We need a FastAPI developer.",
            "requirements": "FastAPI experience.",
            "salary_range": "$100,000",
            "location": "Remote",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {emp_token}"}
    )
    job_id = job_resp.json()["id"]

    # Register job seeker
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker_app@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    seeker_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "seeker_app@example.com",
            "password": "password123"
        }
    )
    seeker_token = seeker_login.json()["access_token"]

    # Apply for job
    pdf_content = b"%PDF-1.4 dummy pdf content"
    response = client.post(
        f"/api/v1/jobs/{job_id}/apply",
        data={"cover_letter": "I am very interested in this role."},
        files={"resume": ("resume.pdf", io.BytesIO(pdf_content), "application/pdf")},
        headers={"Authorization": f"Bearer {seeker_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["job_id"] == job_id
    assert data["status"] == "Applied"
    assert "resume_url" in data

def test_apply_for_job_invalid_file_type(client):
    # AC: Only PDF files are allowed
    # Register employer and create a job
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer_app2@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    emp_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer_app2@example.com",
            "password": "password123"
        }
    )
    emp_token = emp_login.json()["access_token"]

    job_resp = client.post(
        "/api/v1/jobs",
        json={
            "title": "FastAPI Developer",
            "description": "We need a FastAPI developer.",
            "requirements": "FastAPI experience.",
            "salary_range": "$100,000",
            "location": "Remote",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {emp_token}"}
    )
    job_id = job_resp.json()["id"]

    # Register job seeker
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker_app2@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    seeker_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "seeker_app2@example.com",
            "password": "password123"
        }
    )
    seeker_token = seeker_login.json()["access_token"]

    # Apply with a text file instead of PDF
    response = client.post(
        f"/api/v1/jobs/{job_id}/apply",
        data={"cover_letter": "I am very interested in this role."},
        files={"resume": ("resume.txt", io.BytesIO(b"not a pdf"), "text/plain")},
        headers={"Authorization": f"Bearer {seeker_token}"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Only PDF files are allowed"

def test_employer_manage_applications(client):
    # AC: Employers can view a list of applications for each of their job postings and update application status
    # Register employer and create a job
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer_app3@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    emp_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer_app3@example.com",
            "password": "password123"
        }
    )
    emp_token = emp_login.json()["access_token"]

    job_resp = client.post(
        "/api/v1/jobs",
        json={
            "title": "FastAPI Developer",
            "description": "We need a FastAPI developer.",
            "requirements": "FastAPI experience.",
            "salary_range": "$100,000",
            "location": "Remote",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {emp_token}"}
    )
    job_id = job_resp.json()["id"]

    # Register job seeker and apply
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker_app3@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    seeker_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "seeker_app3@example.com",
            "password": "password123"
        }
    )
    seeker_token = seeker_login.json()["access_token"]

    pdf_content = b"%PDF-1.4 dummy pdf content"
    app_resp = client.post(
        f"/api/v1/jobs/{job_id}/apply",
        data={"cover_letter": "I am very interested in this role."},
        files={"resume": ("resume.pdf", io.BytesIO(pdf_content), "application/pdf")},
        headers={"Authorization": f"Bearer {seeker_token}"}
    )
    app_id = app_resp.json()["id"]

    # Employer lists applications
    list_resp = client.get(
        f"/api/v1/jobs/{job_id}/applications",
        headers={"Authorization": f"Bearer {emp_token}"}
    )
    assert list_resp.status_code == 200
    apps = list_resp.json()
    assert len(apps) == 1
    assert apps[0]["id"] == app_id
    assert apps[0]["job_seeker"]["email"] == "seeker_app3@example.com"

    # Employer updates application status
    status_resp = client.patch(
        f"/api/v1/applications/{app_id}/status",
        json={"status": "Interviewing"},
        headers={"Authorization": f"Bearer {emp_token}"}
    )
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "Interviewing"
