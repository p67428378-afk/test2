def test_list_courses(client):
    response = client.get("/api/v1/courses")
    assert response.status_code == 200
    courses = response.json()
    assert len(courses) >= 3
    codes = [c["course_code"] for c in courses]
    assert "CS101" in codes
    assert "MATH201" in codes


def test_search_and_filter_courses(client):
    response = client.get("/api/v1/courses?search=Computer")
    assert response.status_code == 200
    courses = response.json()
    assert len(courses) >= 1
    assert courses[0]["course_code"] == "CS101"

    response_sem = client.get("/api/v1/courses?semester=Fall 2026")
    assert response_sem.status_code == 200
    assert len(response_sem.json()) >= 3


def test_get_course_detail(client):
    list_res = client.get("/api/v1/courses")
    course_id = list_res.json()[0]["id"]

    response = client.get(f"/api/v1/courses/{course_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == course_id
    assert "modules" in data
    assert len(data["modules"]) >= 1


def test_get_nonexistent_course(client):
    response = client.get("/api/v1/courses/non-existent-uuid")
    assert response.status_code == 404


def test_faculty_create_course(client, faculty_auth_headers):
    response = client.post(
        "/api/v1/courses",
        headers=faculty_auth_headers,
        json={
            "course_code": "PHYS301",
            "title": "Quantum Physics I",
            "description": "Introduction to wave mechanics and quantum theory.",
            "semester": "Fall 2026",
            "is_active": True,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["course_code"] == "PHYS301"
    assert data["title"] == "Quantum Physics I"


def test_student_create_course_forbidden(client, student_auth_headers):
    response = client.post(
        "/api/v1/courses",
        headers=student_auth_headers,
        json={
            "course_code": "BIO101",
            "title": "General Biology",
            "semester": "Fall 2026",
        },
    )
    assert response.status_code == 403


def test_duplicate_course_code_rejected(client, faculty_auth_headers):
    response = client.post(
        "/api/v1/courses",
        headers=faculty_auth_headers,
        json={
            "course_code": "CS101",
            "title": "Another CS Course",
            "semester": "Fall 2026",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_student_enroll_in_course(client, student_auth_headers):
    # Get ENG102 course (not enrolled initially in seed for student)
    list_res = client.get("/api/v1/courses?search=ENG102")
    eng_course = list_res.json()[0]

    response = client.post(
        f"/api/v1/courses/{eng_course['id']}/enroll",
        headers=student_auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["course_id"] == eng_course["id"]

    # Duplicate enrollment returns 400
    dup_res = client.post(
        f"/api/v1/courses/{eng_course['id']}/enroll",
        headers=student_auth_headers,
    )
    assert dup_res.status_code == 400
    assert "already enrolled" in dup_res.json()["detail"]


def test_get_my_enrollments_and_drop(client, student_auth_headers):
    response = client.get("/api/v1/enrollments/my", headers=student_auth_headers)
    assert response.status_code == 200
    enrollments = response.json()
    assert len(enrollments) >= 1

    course_id = enrollments[0]["course_id"]
    drop_res = client.delete(
        f"/api/v1/enrollments/{course_id}", headers=student_auth_headers
    )
    assert drop_res.status_code == 200
    assert "Successfully dropped" in drop_res.json()["message"]


def test_get_course_roster(client, faculty_auth_headers):
    list_res = client.get("/api/v1/courses?search=CS101")
    cs_course = list_res.json()[0]

    response = client.get(
        f"/api/v1/courses/{cs_course['id']}/roster",
        headers=faculty_auth_headers,
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
