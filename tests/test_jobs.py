def test_create_job_posting(client):
    # AC: Employers can create and publish job postings
    # Register employer
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer1@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer1@example.com",
            "password": "password123"
        }
    )
    token = login_resp.json()["access_token"]

    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Senior Python Developer",
            "description": "We are looking for a Senior Python Developer to join our team.",
            "requirements": "5+ years of experience with Python and FastAPI.",
            "salary_range": "$120,000 - $150,000",
            "location": "Remote",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Senior Python Developer"
    assert data["location"] == "Remote"
    assert data["job_type"] == "full-time"
    assert data["is_active"] is True

def test_create_job_posting_forbidden_for_seeker(client):
    # AC: Job seekers cannot create job postings
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "seeker1@example.com",
            "password": "password123",
            "role": "job_seeker"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "seeker1@example.com",
            "password": "password123"
        }
    )
    token = login_resp.json()["access_token"]

    response = client.post(
        "/api/v1/jobs",
        json={
            "title": "Senior Python Developer",
            "description": "We are looking for a Senior Python Developer to join our team.",
            "requirements": "5+ years of experience with Python and FastAPI.",
            "salary_range": "$120,000 - $150,000",
            "location": "Remote",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Only employers can perform this action"

def test_search_and_filter_jobs(client):
    # AC: Job seekers can search for jobs by keywords, location, and filter by job type
    # Register employer and create jobs
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer2@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer2@example.com",
            "password": "password123"
        }
    )
    token = login_resp.json()["access_token"]

    # Create Job 1
    client.post(
        "/api/v1/jobs",
        json={
            "title": "FastAPI Backend Engineer",
            "description": "Join our data engineering team to build robust backend pipelines.",
            "requirements": "Experience with SQLAlchemy, PostgreSQL, and Docker.",
            "salary_range": "$90 - $110 / hour",
            "location": "New York, NY",
            "job_type": "contract"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    # Create Job 2
    client.post(
        "/api/v1/jobs",
        json={
            "title": "React Frontend Developer",
            "description": "Build beautiful user interfaces using React and Tailwind CSS.",
            "requirements": "3+ years of experience with React.",
            "salary_range": "$100,000 - $120,000",
            "location": "Remote",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    # Search by keyword "FastAPI"
    response = client.get("/api/v1/jobs?search=FastAPI")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "FastAPI Backend Engineer"

    # Filter by location "Remote"
    response = client.get("/api/v1/jobs?location=Remote")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "React Frontend Developer"

    # Filter by job type "contract"
    response = client.get("/api/v1/jobs?job_type=contract")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "FastAPI Backend Engineer"

def test_update_job_posting(client):
    # AC: Employers can edit their job postings
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer3@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer3@example.com",
            "password": "password123"
        }
    )
    token = login_resp.json()["access_token"]

    create_resp = client.post(
        "/api/v1/jobs",
        json={
            "title": "Python Developer",
            "description": "We are looking for a Python Developer.",
            "requirements": "Experience with Python.",
            "salary_range": "$80,000",
            "location": "Chicago, IL",
            "job_type": "full-time"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    job_id = create_resp.json()["id"]

    response = client.put(
        f"/api/v1/jobs/{job_id}",
        json={
            "title": "Senior Python Developer",
            "salary_range": "$130,000"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Senior Python Developer"
    assert data["salary_range"] == "$130,000"

def test_delete_job_posting(client):
    # AC: Employers can delete their job postings
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "employer4@example.com",
            "password": "password123",
            "role": "employer"
        }
    )
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "employer4@example.com",
            "password": "password123"
        }
    )
    token = login_resp.json()["access_token"]

    create_resp = client.post(
        "/api/v1/jobs",
        json={
            "title": "Temporary Job",
            "description": "This job will be deleted.",
            "requirements": "At least 10 characters of requirements.",
            "salary_range": "None",
            "location": "Local",
            "job_type": "contract"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    job_id = create_resp.json()["id"]

    response = client.delete(
        f"/api/v1/jobs/{job_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 204

    # Verify it's gone
    get_resp = client.get(f"/api/v1/jobs/{job_id}")
    assert get_resp.status_code == 404
