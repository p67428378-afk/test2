import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

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

def test_list_and_submit_reports():
    # List reports
    response = client.get("/api/v1/reports")
    assert response.status_code == 200
    reports = response.json()
    assert len(reports) > 0
    report_id = reports[0]["id"]

    # Submit report
    response = client.post(f"/api/v1/reports/{report_id}/submit")
    assert response.status_code == 200
    assert response.json()["status"] == "SUBMITTED"
