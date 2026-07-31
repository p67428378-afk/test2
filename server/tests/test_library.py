from datetime import datetime, timedelta
import uuid


def get_auth_headers(client, email, password):
    response = client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_auth_login(client):
    # Test login with seeded admin
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

    # Test login with seeded member
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

    # Test login with invalid credentials
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_get_current_user(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")
    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    assert response.json()["role"] == "member"


def test_book_management_librarian(client):
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")

    # Create book
    book_data = {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "isbn": "9780007488308",
        "genre": "Fantasy",
        "publication_year": 1937,
        "total_copies": 3,
    }
    response = client.post("/api/v1/books", json=book_data, headers=headers)
    assert response.status_code == 201
    book_id = response.json()["id"]
    assert response.json()["title"] == "The Hobbit"
    assert response.json()["available_copies"] == 3

    # Get book details
    response = client.get(f"/api/v1/books/{book_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "The Hobbit"

    # Update book
    update_data = {"total_copies": 5}
    response = client.put(f"/api/v1/books/{book_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["total_copies"] == 5
    assert response.json()["available_copies"] == 5

    # Delete book
    response = client.delete(f"/api/v1/books/{book_id}", headers=headers)
    assert response.status_code == 204


def test_book_management_member_denied(client):
    headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Try to create book
    book_data = {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "isbn": "9780007488308",
        "genre": "Fantasy",
        "publication_year": 1937,
        "total_copies": 3,
    }
    response = client.post("/api/v1/books", json=book_data, headers=headers)
    assert response.status_code == 403


def test_book_search_and_filter(client):
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    member_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create some books
    client.post(
        "/api/v1/books",
        json={
            "title": "Dune",
            "author": "Frank Herbert",
            "isbn": "9780441172719",
            "genre": "Sci-Fi",
            "publication_year": 1965,
            "total_copies": 2,
        },
        headers=admin_headers,
    )

    client.post(
        "/api/v1/books",
        json={
            "title": "Foundation",
            "author": "Isaac Asimov",
            "isbn": "9780553293357",
            "genre": "Sci-Fi",
            "publication_year": 1951,
            "total_copies": 1,
        },
        headers=admin_headers,
    )

    # Search by title
    response = client.get("/api/v1/books?search=Dune", headers=member_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Dune"

    # Filter by genre
    response = client.get("/api/v1/books?genre=Sci-Fi", headers=member_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_member_management_librarian(client):
    headers = get_auth_headers(client, "admin@example.com", "adminpassword")

    # Create member
    member_data = {
        "email": "newmember@example.com",
        "full_name": "New Member",
        "password": "newpassword",
        "role": "member",
    }
    response = client.post("/api/v1/members", json=member_data, headers=headers)
    assert response.status_code == 201
    member_id = response.json()["id"]
    assert response.json()["email"] == "newmember@example.com"

    # Get member details
    response = client.get(f"/api/v1/members/{member_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["full_name"] == "New Member"

    # Update member
    update_data = {"full_name": "Updated Name"}
    response = client.put(
        f"/api/v1/members/{member_id}", json=update_data, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Updated Name"


def test_book_borrowing_and_returning(client, db):
    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    member_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create book
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780007488308",
            "genre": "Fantasy",
            "publication_year": 1937,
            "total_copies": 1,
        },
        headers=admin_headers,
    )
    book_id = response.json()["id"]

    # Get member ID
    response = client.get("/api/v1/users/me", headers=member_headers)
    member_id = response.json()["id"]

    # Checkout book
    loan_data = {"book_id": book_id, "member_id": member_id}
    response = client.post("/api/v1/loans", json=loan_data, headers=admin_headers)
    assert response.status_code == 201
    loan_id = response.json()["id"]

    # Verify book copies decremented
    response = client.get(f"/api/v1/books/{book_id}", headers=member_headers)
    assert response.json()["available_copies"] == 0

    # Try to checkout again (should fail as copies = 0)
    response = client.post("/api/v1/loans", json=loan_data, headers=admin_headers)
    assert response.status_code == 400

    # Return book
    response = client.put(f"/api/v1/loans/{loan_id}/return", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["return_date"] is not None

    # Verify book copies incremented
    response = client.get(f"/api/v1/books/{book_id}", headers=member_headers)
    assert response.json()["available_copies"] == 1


def test_overdue_fine_calculation(client, db):
    from server import models

    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    member_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create book
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780007488308",
            "genre": "Fantasy",
            "publication_year": 1937,
            "total_copies": 1,
        },
        headers=admin_headers,
    )
    book_id = response.json()["id"]

    # Get member ID
    response = client.get("/api/v1/users/me", headers=member_headers)
    member_id = response.json()["id"]

    # Checkout book
    loan_data = {"book_id": book_id, "member_id": member_id}
    response = client.post("/api/v1/loans", json=loan_data, headers=admin_headers)
    loan_id = response.json()["id"]

    # Manually update due date to 5 days ago in the database to simulate overdue
    db_loan = db.query(models.Loan).filter(models.Loan.id == uuid.UUID(loan_id)).first()
    db_loan.due_date = datetime.utcnow() - timedelta(days=5)
    db.commit()

    # Return book
    response = client.put(f"/api/v1/loans/{loan_id}/return", headers=admin_headers)
    assert response.status_code == 200

    # Verify fine was created
    response = client.get("/api/v1/fines", headers=admin_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    # 5 days overdue, but let's check if weekends were excluded.
    # Since we used datetime.utcnow() - timedelta(days=5), the exact number of overdue days depends on the current day of the week.
    # But it should be > 0 and status should be outstanding.
    assert response.json()[0]["status"] == "outstanding"
    assert response.json()[0]["amount"] > 0


def test_due_date_reminders(client, db):
    from server import models

    admin_headers = get_auth_headers(client, "admin@example.com", "adminpassword")
    member_headers = get_auth_headers(client, "test@example.com", "testpassword")

    # Create book
    response = client.post(
        "/api/v1/books",
        json={
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "isbn": "9780007488308",
            "genre": "Fantasy",
            "publication_year": 1937,
            "total_copies": 1,
        },
        headers=admin_headers,
    )
    book_id = response.json()["id"]

    # Get member ID
    response = client.get("/api/v1/users/me", headers=member_headers)
    member_id = response.json()["id"]

    # Checkout book
    loan_data = {"book_id": book_id, "member_id": member_id}
    response = client.post("/api/v1/loans", json=loan_data, headers=admin_headers)
    loan_id = response.json()["id"]

    # Manually update due date to exactly 3 days from now
    db_loan = db.query(models.Loan).filter(models.Loan.id == uuid.UUID(loan_id)).first()
    db_loan.due_date = datetime.utcnow() + timedelta(days=3)
    db.commit()

    # Trigger reminders
    response = client.post("/api/v1/loans/reminders", headers=admin_headers)
    assert response.status_code == 200
    assert len(response.json()["reminders_sent"]) == 1
    assert response.json()["reminders_sent"][0]["member_email"] == "test@example.com"
