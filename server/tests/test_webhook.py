import pytest
import time
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
    db = TestingSessionLocal()
    db.query(models.Issue).delete()
    db.query(models.Review).delete()
    db.query(models.CodeReviewConfig).delete()
    db.commit()
    db.close()
    yield

def test_webhook_trigger_scan():
    payload = {
        "action": "opened",
        "pull_request": {
            "number": 42,
            "title": "Add new feature",
            "head": {
                "ref": "feature-xyz"
            }
        },
        "repository": {
            "full_name": "p67428378-afk/test2"
        }
    }

    response = client.post("/api/v1/webhook", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "initiated" in data["message"]

    # Wait a brief moment for background task to run
    time.sleep(1.5)

    # Verify review and issues in DB
    db = TestingSessionLocal()
    review = db.query(models.Review).filter(models.Review.pr_id == "42").first()
    assert review is not None
    assert review.title == "Add new feature"
    assert review.branch_name == "feature-xyz"
    assert review.status in ["APPROVED", "CHANGES_REQUESTED"]

    # Since we scan the actual workspace, let's see if any issues were found
    issues = db.query(models.Issue).filter(models.Issue.review_id == review.review_id).all()
    print(f"Found {len(issues)} issues in workspace scan")
    db.close()
