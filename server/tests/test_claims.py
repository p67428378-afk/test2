import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.main import app
from server.database import Base, get_db

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Instant Vehicle Damage Estimate API" in response.json()["message"]


def test_upload_no_files():
    response = client.post("/api/v1/claims/upload", files=[])
    assert response.status_code == 400


def test_upload_invalid_file_type():
    file_data = {"files": ("test.txt", b"some text content", "text/plain")}
    response = client.post("/api/v1/claims/upload", files=file_data)
    assert response.status_code == 400


def test_upload_and_poll_flow():
    # Upload valid images
    files = [
        ("files", ("front.jpg", b"fake_image_data_1", "image/jpeg")),
        ("files", ("side.jpg", b"fake_image_data_2", "image/png")),
    ]
    response = client.post("/api/v1/claims/upload", files=files)
    assert response.status_code == 202
    data = response.json()
    assert "claim_id" in data
    claim_id = data["claim_id"]

    # Poll the estimate endpoint
    poll_response = client.get(f"/api/v1/claims/{claim_id}/estimate")
    assert poll_response.status_code == 200
    poll_data = poll_response.json()
    assert poll_data["status"] in ["PROCESSING", "READY", "FAILED"]


def test_get_non_existent_claim():
    response = client.get(
        "/api/v1/claims/00000000-0000-0000-0000-000000000000/estimate"
    )
    assert response.status_code == 404
