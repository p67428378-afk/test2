import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models
from server.core import security
from datetime import date, timedelta

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_leave.db"

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


client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    # Clear any existing overrides to prevent interference from other test files
    app.dependency_overrides.clear()
    app.dependency_overrides[get_db] = override_get_db

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        # Seed manager
        manager = models.User(
            login_id="manager",
            hashed_password=security.get_password_hash("testpassword"),
            email="manager@example.com",
            name="Manager User",
            role="manager",
            mobile_number="0987654321",
            security_question="What is your favorite color?",
            security_answer_hash="blue",
            leave_balance=20,
        )
        db.add(manager)
        db.commit()
        db.refresh(manager)

        # Seed employee
        employee = models.User(
            login_id="testuser",
            hashed_password=security.get_password_hash("testpassword"),
            email="test@example.com",
            name="Test User",
            role="employee",
            mobile_number="1234567890",
            security_question="What is your favorite color?",
            security_answer_hash="blue",
            leave_balance=20,
            manager_id=manager.id,
        )
        db.add(employee)
        db.commit()
    finally:
        db.close()


def get_auth_headers(login_id: str, password: str):
    response = client.post(
        "/api/v1/auth/login", json={"login_id": login_id, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_login_success():
    response = client.post(
        "/api/v1/auth/login", json={"login_id": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["login_id"] == "testuser"


def test_login_failure():
    response = client.post(
        "/api/v1/auth/login", json={"login_id": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_get_me():
    headers = get_auth_headers("testuser", "testpassword")
    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["login_id"] == "testuser"


def test_apply_leave_success():
    headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() + timedelta(days=1)
    end_date = start_date + timedelta(days=2)  # 3 days

    response = client.post(
        "/api/v1/leave-requests",
        headers=headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "reason": "Family trip",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Pending"
    assert data["leave_type"] == "Vacation"


def test_apply_leave_invalid_dates():
    headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() + timedelta(days=5)
    end_date = start_date - timedelta(days=1)  # end before start

    response = client.post(
        "/api/v1/leave-requests",
        headers=headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "reason": "Family trip",
        },
    )
    assert response.status_code == 400
    assert "End date cannot be before start date" in response.json()["detail"]


def test_apply_leave_past_date():
    headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() - timedelta(days=1)  # past date
    end_date = start_date + timedelta(days=2)

    response = client.post(
        "/api/v1/leave-requests",
        headers=headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "reason": "Family trip",
        },
    )
    assert response.status_code == 400
    assert "Cannot submit requests for past dates" in response.json()["detail"]


def test_apply_leave_insufficient_balance():
    headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() + timedelta(days=1)
    end_date = start_date + timedelta(days=25)  # 26 days, balance is 20

    response = client.post(
        "/api/v1/leave-requests",
        headers=headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "reason": "Family trip",
        },
    )
    assert response.status_code == 400
    assert "Insufficient leave balance" in response.json()["detail"]


def test_get_my_leave_requests():
    headers = get_auth_headers("testuser", "testpassword")
    # Apply first
    start_date = date.today() + timedelta(days=1)
    client.post(
        "/api/v1/leave-requests",
        headers=headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": (start_date + timedelta(days=1)).isoformat(),
            "reason": "Trip",
        },
    )

    response = client.get("/api/v1/leave-requests/me", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_team_leave_requests_as_manager():
    # Apply as employee
    emp_headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() + timedelta(days=1)
    client.post(
        "/api/v1/leave-requests",
        headers=emp_headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": (start_date + timedelta(days=1)).isoformat(),
            "reason": "Trip",
        },
    )

    # Get as manager
    mgr_headers = get_auth_headers("manager", "testpassword")
    response = client.get("/api/v1/leave-requests/team", headers=mgr_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["employee_name"] == "Test User"


def test_get_team_leave_requests_as_employee_forbidden():
    headers = get_auth_headers("testuser", "testpassword")
    response = client.get("/api/v1/leave-requests/team", headers=headers)
    assert response.status_code == 403


def test_approve_leave_request():
    # Apply as employee
    emp_headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() + timedelta(days=1)
    apply_resp = client.post(
        "/api/v1/leave-requests",
        headers=emp_headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": (start_date + timedelta(days=2)).isoformat(),  # 3 days
            "reason": "Trip",
        },
    )
    req_id = apply_resp.json()["id"]

    # Approve as manager
    mgr_headers = get_auth_headers("manager", "testpassword")
    response = client.put(
        f"/api/v1/leave-requests/{req_id}/status",
        headers=mgr_headers,
        json={"status": "Approved", "comment": "Have fun!"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Approved"
    assert response.json()["manager_comment"] == "Have fun!"

    # Check employee balance deducted
    me_resp = client.get("/api/v1/users/me", headers=emp_headers)
    assert me_resp.json()["leave_balance"] == 17  # 20 - 3


def test_reject_leave_request():
    # Apply as employee
    emp_headers = get_auth_headers("testuser", "testpassword")
    start_date = date.today() + timedelta(days=1)
    apply_resp = client.post(
        "/api/v1/leave-requests",
        headers=emp_headers,
        json={
            "leave_type": "Vacation",
            "start_date": start_date.isoformat(),
            "end_date": (start_date + timedelta(days=2)).isoformat(),  # 3 days
            "reason": "Trip",
        },
    )
    req_id = apply_resp.json()["id"]

    # Reject as manager
    mgr_headers = get_auth_headers("manager", "testpassword")
    response = client.put(
        f"/api/v1/leave-requests/{req_id}/status",
        headers=mgr_headers,
        json={"status": "Rejected", "comment": "Too busy"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Rejected"

    # Check employee balance NOT deducted
    me_resp = client.get("/api/v1/users/me", headers=emp_headers)
    assert me_resp.json()["leave_balance"] == 20
