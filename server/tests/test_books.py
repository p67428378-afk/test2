import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app
import os

# Use a unique SQLite file for each test run to avoid cross-test pollution
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_books_run.db"
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
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test_books_run.db"):
        try:
            os.remove("test_books_run.db")
        except Exception:
            pass


def test_create_and_list_books():
    # Create a book
    book_data = {
        "title": "Harry Potter and the Philosopher's Stone",
        "description": "The first book in the series.",
        "price": 19.99,
        "isbn": "9780747532699",
        "cover_image_url": "http://example.com/cover.jpg",
        "stock_quantity": 10,
        "format": "Paperback",
    }
    response = client.post("/api/v1/books", json=book_data)
    assert response.status_code == 201 or response.status_code == 200
    data = response.json()
    assert "id" in data
    book_id = data["id"]

    # Get the book
    response = client.get(f"/api/v1/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["title"] == book_data["title"]

    # List books
    response = client.get("/api/v1/books")
    assert response.status_code == 200
    assert len(response.json()) == 1
