from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, engine, SessionLocal, get_db
from server import models, auth
import pytest


# Override get_db to use the same SessionLocal as the test
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_login_success():
    db = SessionLocal()
    # Ensure test guide exists
    guide = (
        db.query(models.Guide)
        .filter(models.Guide.email == "test_auth@example.com")
        .first()
    )
    if not guide:
        guide = models.Guide(
            email="test_auth@example.com",
            password_hash=auth.get_password_hash("password123"),
            full_name="Auth Test Guide",
        )
        db.add(guide)
        db.commit()
    db.close()

    client = TestClient(app)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test_auth@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["guide"]["email"] == "test_auth@example.com"


def test_login_invalid_credentials():
    client = TestClient(app)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials provided"
