import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.app.models.book import Book

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_db():
    # Clear books table before each test
    db = TestingSessionLocal()
    db.query(Book).delete()
    db.commit()
    db.close()


def test_create_book_success():
    # AC 1: Given the librarian is on the 'Add Book' page, when they enter the book's title, author, ISBN, and publication date, and click 'Save', then the book is successfully added to the catalog.
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "isbn": "9780743273565",
            "publication_date": "2004-09-30",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "The Great Gatsby"
    assert data["author"] == "F. Scott Fitzgerald"
    assert data["isbn"] == "9780743273565"
    assert data["publication_date"] == "2004-09-30"
    assert "id" in data
    assert "status" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_book_default_status():
    # AC 4: Given the book is newly added, then its status should be set to 'Available' by default.
    response = client.post(
        "/api/v1/books",
        json={"title": "1984", "author": "George Orwell", "isbn": "9780451524935"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "Available"


def test_create_book_duplicate_isbn():
    # AC 3: Given the librarian attempts to add a book with an ISBN that already exists, then the system should display a warning message to prevent duplicate entries.
    # First, add a book
    response1 = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780547928227",
        },
    )
    assert response1.status_code == 201

    # Try to add another book with the same ISBN
    response2 = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit - Duplicate",
            "author": "Tolkien",
            "isbn": "9780547928227",
        },
    )
    assert response2.status_code == 400
    assert response2.json()["detail"] == "ISBN already exists in the catalog"


def test_create_book_missing_mandatory_fields():
    # AC 5: Given the librarian is entering the book details, when they leave a mandatory field (e.g., Title, ISBN) empty, then the system should display an error message and prevent saving.
    # Missing title
    response1 = client.post(
        "/api/v1/books", json={"author": "Author", "isbn": "1234567890"}
    )
    assert response1.status_code == 422

    # Missing isbn
    response2 = client.post(
        "/api/v1/books", json={"title": "Title Only", "author": "Author"}
    )
    assert response2.status_code == 422


def test_list_books_and_search():
    # AC 2: Given the book has been added, when a patron searches for the book, then it should appear in the search results.
    # Add two books
    client.post(
        "/api/v1/books",
        json={
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "isbn": "9780743273565",
        },
    )
    client.post(
        "/api/v1/books",
        json={
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "isbn": "9780061120084",
        },
    )

    # List all books
    response = client.get("/api/v1/books")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    # Search by title
    response_search_title = client.get("/api/v1/books?search=Gatsby")
    assert response_search_title.status_code == 200
    data_search_title = response_search_title.json()
    assert len(data_search_title) == 1
    assert data_search_title[0]["title"] == "The Great Gatsby"

    # Search by author
    response_search_author = client.get("/api/v1/books?search=Harper")
    assert response_search_author.status_code == 200
    data_search_author = response_search_author.json()
    assert len(data_search_author) == 1
    assert data_search_author[0]["title"] == "To Kill a Mockingbird"

    # Search by ISBN
    response_search_isbn = client.get("/api/v1/books?search=9780061120084")
    assert response_search_isbn.status_code == 200
    data_search_isbn = response_search_isbn.json()
    assert len(data_search_isbn) == 1
    assert data_search_isbn[0]["title"] == "To Kill a Mockingbird"
