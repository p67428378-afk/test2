import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models
from datetime import date
import os

# Use the active test database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(name="session", scope="function")
def session_fixture():
    # Import models to register them on Base
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(name="client", scope="function")
def client_fixture(session):
    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_attendance_flow(client, session):
    # 1. Seed Users
    teacher = models.User(email="teacher@school.com", name="Mr. Smith", role="Teacher")
    student1 = models.User(
        email="student1@school.com",
        name="Alice Johnson",
        role="Student",
        parent_email="parent1@example.com",
        parent_phone="+1234567890",
    )
    student2 = models.User(
        email="student2@school.com",
        name="Bob Brown",
        role="Student",
        parent_email="parent2@example.com",
    )
    session.add_all([teacher, student1, student2])
    session.commit()

    # 2. Seed Class
    class_obj = models.Class(name="Grade 10 Math", grade="10", teacher_id=teacher.id)
    session.add(class_obj)
    session.commit()

    # 3. Mark Attendance (Teacher)
    headers = {"X-User-Email": "teacher@school.com"}
    payload = {
        "class_id": str(class_obj.id),
        "date": str(date.today()),
        "records": [
            {"student_id": str(student1.id), "status": "Absent"},
            {"student_id": str(student2.id), "status": "Present"},
        ],
    }
    response = client.post("/api/v1/attendance", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["processed_count"] == 2

    # 4. Get Attendance Records
    response = client.get(
        f"/api/v1/attendance?class_id={class_obj.id}", headers=headers
    )
    assert response.status_code == 200
    records = response.json()
    assert len(records) == 2

    # Verify student1 is Absent and has a notification sent
    absent_record = next(r for r in records if r["student_id"] == str(student1.id))
    assert absent_record["status"] == "Absent"
    assert absent_record["last_notification"] == "Sent"

    # 5. Get Student Attendance Detail
    response = client.get(f"/api/v1/attendance/student/{student1.id}", headers=headers)
    assert response.status_code == 200
    detail = response.json()
    assert detail["student_name"] == "Alice Johnson"
    assert detail["absences"] == 1
    assert detail["attendance_rate"] == 0.0
    assert len(detail["notifications"]) == 2  # Email and SMS
