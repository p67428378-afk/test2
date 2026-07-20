import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    # Clear database before each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture(autouse=True)
def override_dependencies():
    # Set overrides
    app.dependency_overrides[get_db] = override_get_db
    yield
    # Clean up overrides after test
    app.dependency_overrides.clear()


client = TestClient(app)


def test_create_book():
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
            "published_year": 1937,
            "genre": "Fantasy",
            "total_copies": 5,
            "available_copies": 5,
            "cover_image_url": "http://example.com/hobbit.jpg",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "The Hobbit"
    assert data["isbn"] == "9780345391803"  # Cleaned ISBN
    assert data["is_available"] is True


def test_create_book_invalid_isbn():
    response = client.post(
        "/api/v1/books",
        json={
            "title": "Invalid Book",
            "author": "Author",
            "isbn": "12345",  # Invalid length
            "published_year": 2020,
            "genre": "Fiction",
            "total_copies": 1,
            "available_copies": 1,
        },
    )
    assert response.status_code == 422  # Pydantic validation error


def test_create_book_duplicate_isbn():
    # Create first book
    res1 = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
            "published_year": 1937,
            "genre": "Fantasy",
        },
    )
    assert res1.status_code == 200

    # Create second book with same ISBN
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit Duplicate",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
            "published_year": 1937,
            "genre": "Fantasy",
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Book with this ISBN already exists"


def test_search_books_by_title():
    # Seed books
    client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780345391803",
        },
    )
    client.post(
        "/api/v1/books",
        json={
            "title": "The Fellowship of the Ring",
            "author": "J.R.R. Tolkien",
            "isbn": "9780618346257",
        },
    )

    # Search partial title
    response = client.get("/api/v1/books/search?query=hobbit")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "The Hobbit"

    # Search case-insensitive
    response = client.get("/api/v1/books/search?query=FELLOWSHIP")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "The Fellowship of the Ring"


def test_search_books_by_author():
    res1 = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780345391803",
        },
    )
    assert res1.status_code == 200

    res2 = client.post(
        "/api/v1/books",
        json={"title": "1984", "author": "George Orwell", "isbn": "9780451524935"},
    )
    assert res2.status_code == 200

    response = client.get("/api/v1/books/search?query=tolkien&search_by=author")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["author"] == "J.R.R. Tolkien"


def test_search_books_by_isbn():
    client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780345391803",
        },
    )

    response = client.get("/api/v1/books/search?query=978-0345391803&search_by=isbn")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["isbn"] == "9780345391803"


def test_search_books_invalid_isbn_format():
    response = client.get("/api/v1/books/search?query=12345&search_by=isbn")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid ISBN format provided"


def test_search_books_no_results():
    response = client.get("/api/v1/books/search?query=Nonexistent")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert len(data["items"]) == 0


def test_search_books_pagination():
    # Seed 15 books
    for i in range(15):
        res = client.post(
            "/api/v1/books",
            json={
                "title": f"Book {i}",
                "author": "Author",
                "isbn": f"97800000000{i:02d}",
            },
        )
        assert res.status_code == 200

    response = client.get("/api/v1/books/search?limit=10&page=1")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 15
    assert len(data["items"]) == 10
    assert data["pages"] == 2

    response = client.get("/api/v1/books/search?limit=10&page=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5
