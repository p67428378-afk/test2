def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_book_with_publication_date(client):
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")

    # Create book with publication_date
    book_data = {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "isbn": "9780007488308",
        "genre": "Fantasy",
        "publication_date": "1937-09-21",
        "total_copies": 3,
    }
    response = client.post("/api/v1/books", json=book_data, headers=headers)
    assert response.status_code == 201
    assert response.json()["title"] == "The Hobbit"
    assert response.json()["publication_date"] == "1937-09-21"


def test_get_books_paginated(client):
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    member_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create a book
    book_data = {
        "title": "Dune",
        "author": "Frank Herbert",
        "isbn": "9780441172719",
        "genre": "Sci-Fi",
        "publication_date": "1965-06-01",
        "total_copies": 2,
    }
    client.post("/api/v1/books", json=book_data, headers=admin_headers)

    # Get books with paginated=true
    response = client.get("/api/v1/books?paginated=true", headers=member_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "limit" in data
    assert "skip" in data
    assert any(item["title"] == "Dune" for item in data["items"])


def test_create_book_duplicate_isbn(client):
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")

    book_data = {
        "title": "Unique Book",
        "author": "Author",
        "isbn": "1234567890",
        "genre": "Fiction",
        "publication_date": "2020-01-01",
        "total_copies": 1,
    }
    response = client.post("/api/v1/books", json=book_data, headers=headers)
    assert response.status_code == 201

    # Try to create again with same ISBN
    response = client.post("/api/v1/books", json=book_data, headers=headers)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]
