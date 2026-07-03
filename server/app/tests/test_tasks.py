"""
Module: test_tasks
Purpose: Unit tests for task CRUD operations, assignment, and reminders
"""

import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.app.database import Base, get_db
from server.app.main import app

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db_session = TestingSessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def auth_headers(client):
    # Register and login a test user
    client.post(
        "/api/v1/auth/register",
        json={"email": "user@example.com", "password": "password123", "role": "member"},
    )
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def colleague_id(client):
    # Register a colleague user
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "colleague@example.com",
            "password": "password123",
            "role": "member",
        },
    )
    return response.json()["id"]


def test_create_task(client, auth_headers):
    # AC: Team members can create tasks with a title, description, priority, and deadline.
    due_date = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    response = client.post(
        "/api/v1/tasks",
        headers=auth_headers,
        json={
            "title": "Test Task",
            "description": "This is a test task",
            "priority": "High",
            "due_date": due_date,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "This is a test task"
    assert data["priority"] == "High"
    assert data["status"] == "To Do"
    assert "id" in data


def test_assign_task(client, auth_headers, colleague_id):
    # AC: Any team member can assign a task to another colleague.
    due_date = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    response = client.post(
        "/api/v1/tasks",
        headers=auth_headers,
        json={
            "title": "Assigned Task",
            "description": "Task to be assigned",
            "priority": "Med",
            "due_date": due_date,
            "assignee_id": colleague_id,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["assignee_id"] == colleague_id


def test_update_task_status(client, auth_headers):
    # AC: The application must allow users to update and track the status of tasks.
    due_date = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    create_response = client.post(
        "/api/v1/tasks",
        headers=auth_headers,
        json={"title": "Task to Update", "priority": "Low", "due_date": due_date},
    )
    task_id = create_response.json()["id"]

    # Update status to In Progress
    update_response = client.put(
        f"/api/v1/tasks/{task_id}", headers=auth_headers, json={"status": "In Progress"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "In Progress"


def test_automated_reminders(client, auth_headers, colleague_id):
    # AC: The system should send automated reminders about task deadlines.
    # Create a task due in 12 hours (less than 24 hours)
    due_date = (datetime.now(timezone.utc) + timedelta(hours=12)).isoformat()
    client.post(
        "/api/v1/tasks",
        headers=auth_headers,
        json={
            "title": "Urgent Task",
            "priority": "High",
            "due_date": due_date,
            "assignee_id": colleague_id,
        },
    )

    # Trigger reminders
    response = client.post("/api/v1/tasks/reminders/trigger", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 1
    assert any(r["title"] == "Urgent Task" for r in data["reminders_sent"])
