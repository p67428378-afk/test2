import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.api.v1.endpoints.auth import get_password_hash
from server import models
import uuid
from datetime import datetime, timedelta

# Use a clean test database for each test run
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_circulation.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Drop and recreate tables to ensure clean state
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        # Seed librarian
        hashed_pw = get_password_hash("testpassword")
        new_lib = models.User(
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password=hashed_pw,
            security_question="What is your favorite color?",
            security_answer_hash=hashed_pw,
        )
        db.add(new_lib)
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="module")
def librarian_token():
    response = client.post(
        "/api/v1/auth/login",
        json={
            "is_librarian": True,
            "username": "test@example.com",
            "password": "testpassword",
        },
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_checkout_and_checkin(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}

    # 1. Create a book
    isbn = f"isbn-{uuid.uuid4()}"
    book_response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "Circulation Book",
            "author": "Author",
            "isbn": isbn,
            "category": "Category",
            "copies_total": 1,
        },
    )
    assert book_response.status_code == 201
    book_id = book_response.json()["id"]

    # 2. Create a patron
    username = f"patron_{uuid.uuid4().hex[:8]}"
    email = f"{username}@example.com"
    patron_response = client.post(
        "/api/v1/patrons",
        headers=headers,
        json={
            "username": username,
            "email": email,
            "password": "patronpassword",
            "full_name": "Circulation Patron",
            "mobile_number": f"555-{uuid.uuid4().hex[:4]}",
        },
    )
    assert patron_response.status_code == 201
    patron_id = patron_response.json()["id"]

    # 3. Checkout the book
    due_date = (datetime.utcnow() + timedelta(days=14)).isoformat() + "Z"
    checkout_response = client.post(
        "/api/v1/circulation/checkout",
        headers=headers,
        json={"book_id": book_id, "patron_id": patron_id, "due_date": due_date},
    )
    assert checkout_response.status_code == 200
    assert checkout_response.json()["status"] == "active"

    # Verify book copies_available is now 0
    book_get = client.get(f"/api/v1/books/{book_id}")
    assert book_get.json()["copies_available"] == 0
    assert book_get.json()["status"] == "checked_out"

    # 4. Checkin the book
    checkin_response = client.post(
        "/api/v1/circulation/checkin", headers=headers, json={"book_id": book_id}
    )
    assert checkin_response.status_code == 200
    assert checkin_response.json()["status"] == "returned"

    # Verify book copies_available is now 1
    book_get = client.get(f"/api/v1/books/{book_id}")
    assert book_get.json()["copies_available"] == 1
    assert book_get.json()["status"] == "available"


def test_reports(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    response = client.get("/api/v1/reports/circulation", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "active_loans" in data
    assert "overdue_loans" in data
    assert "total_loans" in data
