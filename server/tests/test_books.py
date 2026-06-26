import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, engine, SessionLocal, get_db
from server import models
import uuid

# Create tables on the shared engine
Base.metadata.create_all(bind=engine)

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_overrides():
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture(autouse=True)
def clean_db():
    db = SessionLocal()
    try:
        db.query(models.Loan).delete()
        db.query(models.BookCopy).delete()
        db.query(models.Book).delete()
        db.query(models.User).delete()
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


def get_auth_headers(username: str, role: str):
    # Register and login to get token
    email = f"{username}@example.com"
    client.post(
        "/api/v1/users/register",
        json={
            "username": username,
            "email": email,
            "password": "testpassword",
            "role": role,
        },
    )
    response = client.post(
        "/api/v1/users/login", json={"username": username, "password": "testpassword"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_add_book_librarian():
    headers = get_auth_headers("lib_user", "librarian")
    isbn = f"isbn-{uuid.uuid4().hex[:8]}"
    response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "Test Book",
            "author": "Test Author",
            "isbn": isbn,
            "published_date": "2026-01-01",
            "initial_copies": 3,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Book"
    assert data["total_copies"] == 3
    assert data["available_copies"] == 3
    assert data["status"] == "available"


def test_add_book_member_forbidden():
    headers = get_auth_headers("member_user", "member")
    isbn = f"isbn-{uuid.uuid4().hex[:8]}"
    response = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "Test Book",
            "author": "Test Author",
            "isbn": isbn,
            "published_date": "2026-01-01",
            "initial_copies": 3,
        },
    )
    assert response.status_code == 403


def test_list_books_and_search():
    headers = get_auth_headers("lib_user_2", "librarian")
    isbn1 = f"isbn-{uuid.uuid4().hex[:8]}"
    isbn2 = f"isbn-{uuid.uuid4().hex[:8]}"

    # Add two books
    client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "UniqueTitleOne",
            "author": "AuthorOne",
            "isbn": isbn1,
            "published_date": "2026-01-01",
            "initial_copies": 1,
        },
    )
    client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "UniqueTitleTwo",
            "author": "AuthorTwo",
            "isbn": isbn2,
            "published_date": "2026-01-01",
            "initial_copies": 1,
        },
    )

    # List all
    response = client.get("/api/v1/books")
    assert response.status_code == 200
    books = response.json()
    assert len(books) >= 2

    # Search
    response = client.get("/api/v1/books?search=UniqueTitleOne")
    assert response.status_code == 200
    search_results = response.json()
    assert len(search_results) == 1
    assert search_results[0]["title"] == "UniqueTitleOne"


def test_get_book_by_id():
    headers = get_auth_headers("lib_user_3", "librarian")
    isbn = f"isbn-{uuid.uuid4().hex[:8]}"

    create_resp = client.post(
        "/api/v1/books",
        headers=headers,
        json={
            "title": "Detail Book",
            "author": "Detail Author",
            "isbn": isbn,
            "published_date": "2026-01-01",
            "initial_copies": 2,
        },
    )
    book_id = create_resp.json()["id"]

    response = client.get(f"/api/v1/books/{book_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Detail Book"
    assert len(data["copies"]) == 2
    assert data["copies"][0]["status"] == "available"
