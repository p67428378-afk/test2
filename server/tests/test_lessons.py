from fastapi import status


def test_list_lessons(client):
    response = client.get("/api/v1/lessons/")
    assert response.status_code == status.HTTP_200_OK
    lessons = response.json()
    assert len(lessons) >= 1


def test_submit_quiz_correct(client):
    lessons_resp = client.get("/api/v1/lessons/")
    lesson = lessons_resp.json()[0]

    response = client.post(
        f"/api/v1/lessons/{lesson['id']}/quiz",
        json={"answer": lesson["quiz_options"].split(",")[1]},  # e.g., "4-8 glasses"
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["correct"] is True
    assert data["points_awarded"] > 0


def test_submit_quiz_incorrect(client):
    lessons_resp = client.get("/api/v1/lessons/")
    lesson = lessons_resp.json()[0]

    response = client.post(
        f"/api/v1/lessons/{lesson['id']}/quiz",
        json={"answer": "Definitely Wrong Answer"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["correct"] is False
    assert data["points_awarded"] == 0
