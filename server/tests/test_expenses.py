import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_expenses.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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
    # Create a user and get token
    client.post(
        "/api/v1/auth/signup",
        json={"email": "user@example.com", "password": "password123", "name": "User"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "password123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_expense_success(client, auth_headers):
    response = client.post(
        "/api/v1/expenses",
        json={
            "amount": 45.50,
            "category": "Food",
            "description": "Lunch with team",
            "expense_date": "2026-07-09",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 45.50
    assert data["category"] == "Food"
    assert data["description"] == "Lunch with team"
    assert data["expense_date"] == "2026-07-09"
    assert "id" in data


def test_create_expense_invalid_category(client, auth_headers):
    response = client.post(
        "/api/v1/expenses",
        json={
            "amount": 45.50,
            "category": "InvalidCategory",
            "description": "Lunch with team",
            "expense_date": "2026-07-09",
        },
        headers=auth_headers,
    )
    assert response.status_code == 422


def test_create_expense_negative_amount(client, auth_headers):
    response = client.post(
        "/api/v1/expenses",
        json={
            "amount": -10.00,
            "category": "Food",
            "description": "Negative amount",
            "expense_date": "2026-07-09",
        },
        headers=auth_headers,
    )
    assert response.status_code == 422


def test_list_expenses_sorted(client, auth_headers):
    # Create multiple expenses with different dates
    client.post(
        "/api/v1/expenses",
        json={"amount": 10.0, "category": "Food", "expense_date": "2026-07-01"},
        headers=auth_headers,
    )
    client.post(
        "/api/v1/expenses",
        json={"amount": 20.0, "category": "Transport", "expense_date": "2026-07-03"},
        headers=auth_headers,
    )
    client.post(
        "/api/v1/expenses",
        json={"amount": 30.0, "category": "Other", "expense_date": "2026-07-02"},
        headers=auth_headers,
    )

    response = client.get("/api/v1/expenses", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    # Should be sorted by date descending: 2026-07-03, 2026-07-02, 2026-07-01
    assert data[0]["expense_date"] == "2026-07-03"
    assert data[1]["expense_date"] == "2026-07-02"
    assert data[2]["expense_date"] == "2026-07-01"


def test_update_expense_success(client, auth_headers):
    # Create expense
    create_res = client.post(
        "/api/v1/expenses",
        json={"amount": 10.0, "category": "Food", "expense_date": "2026-07-01"},
        headers=auth_headers,
    )
    expense_id = create_res.json()["id"]

    # Update expense
    update_res = client.put(
        f"/api/v1/expenses/{expense_id}",
        json={"amount": 15.50, "category": "Transport"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["amount"] == 15.50
    assert data["category"] == "Transport"


def test_delete_expense_success(client, auth_headers):
    # Create expense
    create_res = client.post(
        "/api/v1/expenses",
        json={"amount": 10.0, "category": "Food", "expense_date": "2026-07-01"},
        headers=auth_headers,
    )
    expense_id = create_res.json()["id"]

    # Delete expense
    delete_res = client.delete(f"/api/v1/expenses/{expense_id}", headers=auth_headers)
    assert delete_res.status_code == 200
    assert delete_res.json()["detail"] == "Expense deleted successfully"

    # Verify deleted
    get_res = client.get("/api/v1/expenses", headers=auth_headers)
    assert len(get_res.json()) == 0
