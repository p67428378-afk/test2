import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    db = TestingSessionLocal()
    try:
        db.execute(text("DELETE FROM courses"))
        db.commit()
    except Exception:
        pass
    finally:
        db.close()
    yield


def test_create_course():
    response = client.post(
        "/api/v1/courses",
        json={
            "title": "Test Course",
            "description": "Test Description",
            "instructor_name": "Test Instructor",
            "price": 19.99,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Course"
    assert data["instructor_name"] == "Test Instructor"
    assert data["price"] == 19.99
    assert "id" in data


def test_get_courses_empty():
    response = client.get("/api/v1/courses")
    assert response.status_code == 200
    assert response.json() == []


def test_get_courses_paginated():
    # Create 3 courses
    for i in range(3):
        client.post(
            "/api/v1/courses",
            json={
                "title": f"Course {i}",
                "description": f"Description {i}",
                "instructor_name": f"Instructor {i}",
                "price": 10.0 + i,
            },
        )

    # Get first 2 courses
    response = client.get("/api/v1/courses?skip=0&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Course 0"
    assert data[1]["title"] == "Course 1"

    # Get next course
    response = client.get("/api/v1/courses?skip=2&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Course 2"
