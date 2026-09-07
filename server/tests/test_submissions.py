from datetime import datetime, timedelta, timezone


def test_submit_assignment_ontime(client, student_auth_headers):
    # Get assignment
    list_res = client.get("/api/v1/assignments")
    assignment = list_res.json()[0]

    response = client.post(
        f"/api/v1/assignments/{assignment['id']}/submit",
        headers=student_auth_headers,
        json={"file_path": "homework1.pdf"},
    )
    assert response.status_code == 201
    receipt = response.json()
    assert "receipt_id" in receipt
    assert receipt["assignment_id"] == assignment["id"]
    assert receipt["file_name"] == "homework1.pdf"
    assert "submitted_at" in receipt


def test_submit_assignment_late(client, student_auth_headers, faculty_auth_headers):
    # Create past-due assignment
    courses_res = client.get("/api/v1/courses?search=CS101")
    cs_course = courses_res.json()[0]

    past_due_date = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
    create_res = client.post(
        "/api/v1/assignments",
        headers=faculty_auth_headers,
        json={
            "course_id": cs_course["id"],
            "title": "Past Due Quiz",
            "due_date": past_due_date,
        },
    )
    assert create_res.status_code == 201
    past_assignment = create_res.json()

    # Submit to past-due assignment
    sub_res = client.post(
        f"/api/v1/assignments/{past_assignment['id']}/submit",
        headers=student_auth_headers,
        json={"file_path": "late_quiz.pdf"},
    )
    assert sub_res.status_code == 201
    receipt = sub_res.json()
    assert receipt["is_late"] is True
    assert receipt["status_badge"] == "Late Submission"


def test_view_and_grade_submission(client, student_auth_headers, faculty_auth_headers):
    list_res = client.get("/api/v1/assignments")
    assignment = list_res.json()[0]

    # Student submits
    sub_res = client.post(
        f"/api/v1/assignments/{assignment['id']}/submit",
        headers=student_auth_headers,
        json={"file_path": "lab4_solution.pdf"},
    )
    assert sub_res.status_code == 201
    submission_id = sub_res.json()["submission_id"]

    # Student checks my submissions
    my_subs = client.get("/api/v1/submissions/my", headers=student_auth_headers)
    assert my_subs.status_code == 200
    assert len(my_subs.json()) >= 1

    # Faculty grades submission
    grade_res = client.post(
        f"/api/v1/submissions/{submission_id}/grade",
        headers=faculty_auth_headers,
        json={
            "grade": 95.0,
            "feedback": "Excellent data structure choices and clean implementation!",
        },
    )
    assert grade_res.status_code == 200
    graded_data = grade_res.json()
    assert graded_data["grade"] == 95.0
    assert "clean implementation" in graded_data["feedback"]

    # Student grading forbidden
    student_grade_res = client.post(
        f"/api/v1/submissions/{submission_id}/grade",
        headers=student_auth_headers,
        json={"grade": 100.0},
    )
    assert student_grade_res.status_code == 403


def test_assignment_submissions_list(
    client, student_auth_headers, faculty_auth_headers
):
    list_res = client.get("/api/v1/assignments")
    assignment = list_res.json()[0]

    # Faculty views all submissions
    faculty_view = client.get(
        f"/api/v1/assignments/{assignment['id']}/submissions",
        headers=faculty_auth_headers,
    )
    assert faculty_view.status_code == 200
    assert isinstance(faculty_view.json(), list)

    # Student views own submissions
    student_view = client.get(
        f"/api/v1/assignments/{assignment['id']}/submissions",
        headers=student_auth_headers,
    )
    assert student_view.status_code == 200
    assert isinstance(student_view.json(), list)
