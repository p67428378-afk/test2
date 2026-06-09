import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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
def setup_and_teardown():
    # Clear tables before each test
    db = TestingSessionLocal()
    db.query(models.Issue).delete()
    db.query(models.Review).delete()
    db.query(models.CodeReviewConfig).delete()
    db.commit()
    db.close()
    yield

def test_get_config_default():
    response = client.get("/api/v1/config")
    assert response.status_code == 200
    data = response.json()
    assert data["pep8_enabled"] is True
    assert data["max_line_length"] == 120
    assert data["owasp_top_10"] is True

def test_update_config():
    response = client.put(
        "/api/v1/config",
        json={"pep8_enabled": False, "max_line_length": 80, "owasp_top_10": False}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["pep8_enabled"] is False
    assert data["max_line_length"] == 80
    assert data["owasp_top_10"] is False

    # Verify it persists
    response = client.get("/api/v1/config")
    assert response.status_code == 200
    assert response.json()["max_line_length"] == 80

def test_get_reviews_empty():
    response = client.get("/api/v1/reviews")
    assert response.status_code == 200
    assert response.json() == []

def test_get_review_not_found():
    response = client.get("/api/v1/reviews/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert response.json()["detail"] == "Review not found"

def test_create_and_get_review():
    # Create a review directly in DB to test GET endpoints
    db = TestingSessionLocal()
    review = models.Review(
        pr_id="12",
        repo_name="test-repo",
        title="Test PR",
        branch_name="feature-branch",
        status="PENDING"
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    issue = models.Issue(
        review_id=review.review_id,
        file_path="server/main.py",
        line_number=10,
        message="Line too long",
        severity="INFO"
    )
    db.add(issue)
    db.commit()
    db.close()

    # Test list reviews
    response = client.get("/api/v1/reviews")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["pr_id"] == "12"
    assert data[0]["issues_count"] == 1

    # Test get review detail
    review_id = data[0]["review_id"]
    response = client.get(f"/api/v1/reviews/{review_id}")
    assert response.status_code == 200
    detail = response.json()
    assert detail["pr_id"] == "12"
    assert detail["title"] == "Test PR"
    assert len(detail["issues"]) == 1
    assert detail["issues"][0]["file_path"] == "server/main.py"
    assert detail["issues"][0]["line_number"] == 10
