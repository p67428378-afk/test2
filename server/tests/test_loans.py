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


def test_borrow_and_return_book():
    lib_headers = get_auth_headers("lib_user_loan", "librarian")
    member_headers = get_auth_headers("member_user_loan", "member")

    # Add a book
    isbn = f"isbn-{uuid.uuid4().hex[:8]}"
    create_resp = client.post(
        "/api/v1/books",
        headers=lib_headers,
        json={
            "title": "Loan Book",
            "author": "Loan Author",
            "isbn": isbn,
            "published_date": "2026-01-01",
            "initial_copies": 1,
        },
    )
    book_id = create_resp.json()["id"]

    # Get book copy ID
    detail_resp = client.get(f"/api/v1/books/{book_id}")
    copy_id = detail_resp.json()["copies"][0]["id"]

    # Borrow book copy
    borrow_resp = client.post(f"/api/v1/loans/borrow/{copy_id}", headers=member_headers)
    assert borrow_resp.status_code == 200
    loan_data = borrow_resp.json()
    assert loan_data["book_copy_id"] == copy_id
    assert loan_data["returned_at"] is None

    # Try to borrow again (should fail)
    borrow_again_resp = client.post(
        f"/api/v1/loans/borrow/{copy_id}", headers=member_headers
    )
    assert borrow_again_resp.status_code == 400
    assert "not available" in borrow_again_resp.json()["detail"]

    # List my loans
    my_loans_resp = client.get("/api/v1/users/me/loans", headers=member_headers)
    assert my_loans_resp.status_code == 200
    my_loans = my_loans_resp.json()
    assert len(my_loans) == 1
    assert my_loans[0]["book_copy_id"] == copy_id
    assert my_loans[0]["status"] == "active"

    # Return book copy
    return_resp = client.post(f"/api/v1/loans/return/{copy_id}", headers=member_headers)
    assert return_resp.status_code == 200
    assert return_resp.json()["returned_at"] is not None

    # Try to return again (should fail)
    return_again_resp = client.post(
        f"/api/v1/loans/return/{copy_id}", headers=member_headers
    )
    assert return_again_resp.status_code == 400
    assert "not currently borrowed" in return_again_resp.json()["detail"]


def test_borrow_limit():
    lib_headers = get_auth_headers("lib_user_limit", "librarian")
    member_headers = get_auth_headers("member_user_limit", "member")

    # Add a book with 6 copies
    isbn = f"isbn-{uuid.uuid4().hex[:8]}"
    create_resp = client.post(
        "/api/v1/books",
        headers=lib_headers,
        json={
            "title": "Limit Book",
            "author": "Limit Author",
            "isbn": isbn,
            "published_date": "2026-01-01",
            "initial_copies": 6,
        },
    )
    book_id = create_resp.json()["id"]

    # Get book copy IDs
    detail_resp = client.get(f"/api/v1/books/{book_id}")
    copies = detail_resp.json()["copies"]

    # Borrow 5 copies (should succeed)
    for i in range(5):
        copy_id = copies[i]["id"]
        resp = client.post(f"/api/v1/loans/borrow/{copy_id}", headers=member_headers)
        assert resp.status_code == 200

    # Try to borrow 6th copy (should fail)
    copy_id_6 = copies[5]["id"]
    resp_6 = client.post(f"/api/v1/loans/borrow/{copy_id_6}", headers=member_headers)
    assert resp_6.status_code == 400
    assert "borrowing limit" in resp_6.json()["detail"]
