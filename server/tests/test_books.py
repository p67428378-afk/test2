def test_create_book(client):
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
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "The Hobbit"
    assert data["author"] == "J.R.R. Tolkien"
    assert data["isbn"] == "9780345391803"  # Hyphens stripped
    assert data["is_available"] is True


def test_create_book_invalid_isbn(client):
    # Too short
    response = client.post(
        "/api/v1/books",
        json={
            "title": "Invalid Book",
            "author": "Author",
            "isbn": "12345",
        },
    )
    assert response.status_code == 400
    assert "Invalid ISBN format" in response.json()["detail"]

    # Invalid characters
    response = client.post(
        "/api/v1/books",
        json={
            "title": "Invalid Book",
            "author": "Author",
            "isbn": "978-034539180a",
        },
    )
    assert response.status_code == 400
    assert "Invalid ISBN format" in response.json()["detail"]


def test_create_book_duplicate_isbn(client):
    # Create first book
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
        },
    )
    assert response.status_code == 201

    # Create second book with same ISBN
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit 2",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_search_books_by_title(client):
    # Seed books
    client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
        },
    )
    client.post(
        "/api/v1/books",
        json={
            "title": "The Fellowship of the Ring",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0618346257",
        },
    )

    # Search full title
    response = client.get("/api/v1/books/search?title=The Hobbit")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "The Hobbit"

    # Search partial title (case-insensitive)
    response = client.get("/api/v1/books/search?title=fellowship")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "The Fellowship of the Ring"


def test_search_books_by_author(client):
    # Seed books
    client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
        },
    )
    client.post(
        "/api/v1/books",
        json={"title": "1984", "author": "George Orwell", "isbn": "978-0451524935"},
    )

    # Search author
    response = client.get("/api/v1/books/search?author=Tolkien")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["author"] == "J.R.R. Tolkien"


def test_search_books_by_isbn(client):
    # Seed book
    client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
        },
    )

    # Search valid ISBN with hyphens
    response = client.get("/api/v1/books/search?isbn=978-0345391803")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "The Hobbit"

    # Search invalid ISBN format
    response = client.get("/api/v1/books/search?isbn=12345")
    assert response.status_code == 400
    assert "Invalid ISBN format" in response.json()["detail"]


def test_general_search(client):
    # Seed books
    client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "978-0345391803",
        },
    )
    client.post(
        "/api/v1/books",
        json={"title": "1984", "author": "George Orwell", "isbn": "978-0451524935"},
    )

    # General search matching title
    response = client.get("/api/v1/books/search?query=Hobbit")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "The Hobbit"

    # General search matching author
    response = client.get("/api/v1/books/search?query=Orwell")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["author"] == "George Orwell"

    # General search matching ISBN
    response = client.get("/api/v1/books/search?query=9780345391803")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "The Hobbit"


def test_search_pagination(client):
    # Seed 15 books
    for i in range(15):
        isbn = f"97800000000{i:02d}"
        client.post(
            "/api/v1/books",
            json={"title": f"Book {i}", "author": "Author", "isbn": isbn},
        )

    # Page 1
    response = client.get("/api/v1/books/search?limit=10&page=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 10
    assert data["total"] == 15
    assert data["page"] == 1
    assert data["pages"] == 2
    assert data["limit"] == 10

    # Page 2
    response = client.get("/api/v1/books/search?limit=10&page=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5
    assert data["page"] == 2


def test_search_no_results(client):
    response = client.get("/api/v1/books/search?query=Nonexistent")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 0
    assert data["total"] == 0
