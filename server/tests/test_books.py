import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.api.v1.endpoints.auth import get_password_hash
from server import models
import uuid

# Use a clean test database for each test run
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_books.db"

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


def test_create_book(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    isbn = f"isbn-{uuid.uuid4()}"
    response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": isbn,
            "category": "Fantasy",
            "copies_total": 3,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "The Hobbit"
    assert data["copies_total"] == 3
    assert data["copies_available"] == 3
    assert data["status"] == "available"


def test_get_books():
    response = client.get("/api/v1/books")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_book_by_id(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    isbn = f"isbn-{uuid.uuid4()}"
    create_response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "1984",
            "author": "George Orwell",
            "isbn": isbn,
            "category": "Dystopian",
            "copies_total": 2,
        },
    )
    book_id = create_response.json()["id"]

    response = client.get(f"/api/v1/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "1984"


def test_update_book(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    isbn = f"isbn-{uuid.uuid4()}"
    create_response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "Animal Farm",
            "author": "George Orwell",
            "isbn": isbn,
            "category": "Dystopian",
            "copies_total": 2,
        },
    )
    book_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/books/{book_id}",
        headers=headers,
        json={
            "title": "Animal Farm (Updated)",
            "author": "George Orwell",
            "isbn": isbn,
            "category": "Dystopian",
            "copies_total": 5,
        },
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Animal Farm (Updated)"
    assert response.json()["copies_total"] == 5


def test_delete_book(librarian_token):
    headers = {"Authorization": f"Bearer {librarian_token}"}
    isbn = f"isbn-{uuid.uuid4()}"
    create_response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "To Delete",
            "author": "Author",
            "isbn": isbn,
            "category": "Category",
            "copies_total": 1,
        },
    )
    book_id = create_response.json()["id"]

    response = client.delete(f"/api/v1/books/{book_id}", headers=headers)
    assert response.status_code == 200
    assert response.json() == {"detail": "Book deleted successfully"}

    # Verify it's gone
    get_response = client.get(f"/api/v1/books/{book_id}")
    assert get_response.status_code == 404
