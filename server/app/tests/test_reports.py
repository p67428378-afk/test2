"""
Module: test_reports
Purpose: Unit tests for manager dashboard and reports
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
def manager_headers(client):
    # Register and login a manager user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "manager@example.com",
            "password": "password123",
            "role": "manager",
        },
    )
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "manager@example.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def member_headers(client):
    # Register and login a member user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "member@example.com",
            "password": "password123",
            "role": "member",
        },
    )
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "member@example.com", "password": "password123"},
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_dashboard_metrics_as_manager(client, manager_headers):
    # AC: Managers need a high-level overview of project and team performance.
    # Create some tasks first
    due_date = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    client.post(
        "/api/v1/tasks",
        headers=manager_headers,
        json={"title": "Task 1", "priority": "High", "due_date": due_date},
    )
    client.post(
        "/api/v1/tasks",
        headers=manager_headers,
        json={"title": "Task 2", "priority": "Med", "due_date": due_date},
    )

    response = client.get("/api/v1/reports/dashboard", headers=manager_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tasks"] == 2
    assert data["tasks_by_priority"]["High"] == 1
    assert data["tasks_by_priority"]["Med"] == 1
    assert "completion_trend" in data


def test_get_dashboard_metrics_as_member_forbidden(client, member_headers):
    # AC: Non-managers should be forbidden from accessing the dashboard metrics
    response = client.get("/api/v1/reports/dashboard", headers=member_headers)
    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized (requires manager role)"
