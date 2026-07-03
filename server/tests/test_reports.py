import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
from server import models
from datetime import date, timedelta
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


def test_reports_flow(client, session):
    # 1. Seed Users
    principal = models.User(
        email="principal@school.com", name="Dr. Principal", role="Principal"
    )
    teacher = models.User(email="teacher@school.com", name="Mr. Smith", role="Teacher")
    student = models.User(
        email="student@school.com", name="Alice Johnson", role="Student"
    )
    session.add_all([principal, teacher, student])
    session.commit()

    # 2. Seed Class
    class_obj = models.Class(name="Grade 10 Math", grade="10", teacher_id=teacher.id)
    session.add(class_obj)
    session.commit()

    # 3. Seed Attendance Records (Alice has been absent for multiple days, rate < 85%)
    today = date.today()
    record1 = models.AttendanceRecord(
        student_id=student.id,
        class_id=class_obj.id,
        status="Absent",
        date=today - timedelta(days=1),
        marked_by=teacher.id,
    )
    record2 = models.AttendanceRecord(
        student_id=student.id,
        class_id=class_obj.id,
        status="Absent",
        date=today,
        marked_by=teacher.id,
    )
    session.add_all([record1, record2])
    session.commit()

    # 4. Get School Report (Principal)
    headers = {"X-User-Email": "principal@school.com"}
    response = client.get("/api/v1/reports/school", headers=headers)
    assert response.status_code == 200
    report = response.json()
    assert report["total_students"] == 1
    assert report["absent_today"] == 1
    assert len(report["watchlist"]) == 1
    assert report["watchlist"][0]["student_name"] == "Alice Johnson"
    assert report["watchlist"][0]["rate"] == 0.0

    # 5. Verify RBAC (Teacher cannot access school-wide reports)
    teacher_headers = {"X-User-Email": "teacher@school.com"}
    response = client.get("/api/v1/reports/school", headers=teacher_headers)
    assert response.status_code == 403
