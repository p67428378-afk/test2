from datetime import datetime, timedelta, timezone


def test_list_assignments(client):
    response = client.get("/api/v1/assignments")
    assert response.status_code == 200
    assignments = response.json()
    assert len(assignments) >= 2


def test_get_assignment_by_id(client):
    list_res = client.get("/api/v1/assignments")
    assignment_id = list_res.json()[0]["id"]

    response = client.get(f"/api/v1/assignments/{assignment_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == assignment_id
    assert "title" in data


def test_get_nonexistent_assignment(client):
    response = client.get("/api/v1/assignments/non-existent-uuid")
    assert response.status_code == 404


def test_faculty_create_assignment(client, faculty_auth_headers):
    courses_res = client.get("/api/v1/courses?search=CS101")
    cs_course = courses_res.json()[0]

    due_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    response = client.post(
        "/api/v1/assignments",
        headers=faculty_auth_headers,
        json={
            "course_id": cs_course["id"],
            "title": "Lab 5: Graph Algorithms and BFS/DFS",
            "description": "Implement BFS and Dijkstra's algorithm in Python.",
            "due_date": due_date,
            "max_points": 100.0,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Lab 5: Graph Algorithms and BFS/DFS"
    assert data["course_id"] == cs_course["id"]


def test_student_create_assignment_forbidden(client, student_auth_headers):
    courses_res = client.get("/api/v1/courses?search=CS101")
    cs_course = courses_res.json()[0]

    due_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    response = client.post(
        "/api/v1/assignments",
        headers=student_auth_headers,
        json={
            "course_id": cs_course["id"],
            "title": "Unauthorized Assignment",
            "due_date": due_date,
        },
    )
    assert response.status_code == 403


def test_list_course_assignments(client):
    courses_res = client.get("/api/v1/courses?search=CS101")
    cs_course = courses_res.json()[0]

    response = client.get(f"/api/v1/courses/{cs_course['id']}/assignments")
    assert response.status_code == 200
    assignments = response.json()
    assert len(assignments) >= 1
    assert assignments[0]["course_id"] == cs_course["id"]
