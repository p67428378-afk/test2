
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.core.config import settings

# Set TESTING to True before importing app to prevent background scheduler from running
settings.TESTING = True

from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_get_dashboard_summary():
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "macro_indicators" in data
    assert "monthly_trends" in data
    assert "net_surplus" in data
    assert "revenue_streams" in data
    assert "sector_expenditure" in data
    assert data["total_revenue"] == 1250000000.0
    assert data["total_expenditure"] == 980000000.0

def test_get_budget_variance():
    response = client.get("/api/v1/dashboard/budget-variance")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Check that Ministry of Defence is highlighted (variance is 6%)
    defence = next((d for d in data if d["department_name"] == "Ministry of Defence"), None)
    assert defence is not None
    assert defence["variance_pct"] == 6.0
    assert defence["highlight"] is True

def test_allocate_emergency_fund_success():
    response = client.post(
        "/api/v1/dashboard/allocate-emergency-fund",
        json={
            "amount": 10000000.0,
            "department": "Ministry of Infrastructure",
            "mfa_code": "123456",
            "project_name": "Bridge Repair"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["amount"] == 10000000.0
    assert data["project_name"] == "Bridge Repair"
    assert "transaction_id" in data

def test_allocate_emergency_fund_invalid_mfa():
    response = client.post(
        "/api/v1/dashboard/allocate-emergency-fund",
        json={
            "amount": 10000000.0,
            "department": "Ministry of Infrastructure",
            "mfa_code": "wrong_code",
            "project_name": "Bridge Repair"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired MFA code"

def test_allocate_emergency_fund_invalid_amount():
    response = client.post(
        "/api/v1/dashboard/allocate-emergency-fund",
        json={
            "amount": -500.0,
            "department": "Ministry of Infrastructure",
            "mfa_code": "123456",
            "project_name": "Bridge Repair"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid input or insufficient funds"

def test_get_dashboard_report():
    response = client.get("/api/v1/dashboard/report")
    assert response.status_code == 200
    data = response.json()
    assert "pdf_binary_stream" in data
    assert isinstance(data["pdf_binary_stream"], str)

def test_get_emergency_fund_transactions():
    # First allocate one
    client.post(
        "/api/v1/dashboard/allocate-emergency-fund",
        json={
            "amount": 5000000.0,
            "department": "Ministry of Healthcare",
            "mfa_code": "123456",
            "project_name": "Vaccine Purchase"
        }
    )
    
    response = client.get("/api/v1/dashboard/emergency-fund-transactions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["project_name"] == "Vaccine Purchase"
    assert data[0]["amount"] == 5000000.0
