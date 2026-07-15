import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import UUID

from server.database import Base, get_db
from server.main import app
from server import models

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_loans_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    # Override dependency inside the fixture to ensure it is active
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed test customer and officer
    customer = models.Customer(
        id=UUID("00000000-0000-0000-0000-000000000001"),
        name="Test Customer",
        email="test@example.com",
        role="customer",
    )
    officer = models.Customer(
        id=UUID("00000000-0000-0000-0000-000000000002"),
        name="Test Officer",
        email="officer@example.com",
        role="loan officer",
    )
    product = models.LoanProduct(
        id=UUID("11111111-1111-1111-1111-111111111111"),
        name="Personal Loan",
        interest_rate=10.5,
        min_tenure_months=12,
        max_tenure_months=60,
        max_loan_amount=500000.00,
    )
    db.add(customer)
    db.add(officer)
    db.add(product)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    # Clear overrides after test to avoid leaking to other test files
    app.dependency_overrides.clear()


client = TestClient(app)


def test_get_loan_products():
    response = client.get("/api/v1/loan-products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Personal Loan"


def test_calculate_emi():
    payload = {"loan_amount": 200000.00, "interest_rate": 10.5, "tenure_months": 24}
    response = client.post("/api/v1/loans/calculate-emi", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "emi" in data
    assert "total_interest" in data
    assert "total_repayment" in data
    assert data["emi"] > 0


def test_create_loan_application_success():
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 100000.00,
        "tenure_months": 24,
        "monthly_income": 50000.00,
        "employment_type": "salaried",
    }
    response = client.post("/api/v1/loans/applications", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "application_id" in data
    assert data["status"] == "Submitted"


def test_create_loan_application_auto_reject():
    # EMI will exceed 50% of income
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 400000.00,
        "tenure_months": 12,
        "monthly_income": 10000.00,
        "employment_type": "salaried",
    }
    response = client.post("/api/v1/loans/applications", json=payload)
    assert response.status_code == 422
    assert "auto-rejected" in response.json()["detail"]


def test_create_loan_application_duplicate():
    # Submit first application
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 50000.00,
        "tenure_months": 12,
        "monthly_income": 50000.00,
        "employment_type": "salaried",
    }
    client.post("/api/v1/loans/applications", json=payload)

    # Submit duplicate
    response = client.post("/api/v1/loans/applications", json=payload)
    assert response.status_code == 409


def test_get_customer_applications():
    # Submit an application first
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 50000.00,
        "tenure_months": 12,
        "monthly_income": 50000.00,
        "employment_type": "salaried",
    }
    client.post("/api/v1/loans/applications", json=payload)

    # Authorized request
    response = client.get(
        "/api/v1/customers/00000000-0000-0000-0000-000000000001/applications",
        headers={"x-user-email": "test@example.com"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

    # Unauthorized request (another customer)
    response_unauth = client.get(
        "/api/v1/customers/00000000-0000-0000-0000-000000000001/applications",
        headers={"x-user-email": "other@example.com"},
    )
    assert response_unauth.status_code == 403


def test_officer_decision_success():
    # Create application first
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 20000.00,
        "tenure_months": 12,
        "monthly_income": 80000.00,
        "employment_type": "self-employed",
    }

    create_resp = client.post("/api/v1/loans/applications", json=payload)
    app_id = create_resp.json()["application_id"]

    # Make decision
    decision_payload = {"decision": "Approved", "remarks": "Excellent profile"}
    response = client.patch(
        f"/api/v1/loans/applications/{app_id}/decision?officer_email=officer@example.com",
        json=decision_payload,
    )
    assert response.status_code == 204


def test_officer_decision_forbidden():
    # Create application first
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 20000.00,
        "tenure_months": 12,
        "monthly_income": 80000.00,
        "employment_type": "self-employed",
    }

    create_resp = client.post("/api/v1/loans/applications", json=payload)
    app_id = create_resp.json()["application_id"]

    # Make decision with customer email
    decision_payload = {"decision": "Approved", "remarks": "Excellent profile"}
    response = client.patch(
        f"/api/v1/loans/applications/{app_id}/decision?officer_email=test@example.com",
        json=decision_payload,
    )
    assert response.status_code == 403


def test_loan_offer_and_schedule_flow():
    # 1. Create application
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 120000.00,
        "tenure_months": 12,
        "monthly_income": 80000.00,
        "employment_type": "salaried",
    }
    create_resp = client.post("/api/v1/loans/applications", json=payload)
    app_id = create_resp.json()["application_id"]

    # 2. Try to make offer on non-approved application (should fail with 409)
    offer_payload = {"offered_amount": 100000.00}
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer?officer_email=officer@example.com",
        json=offer_payload,
    )
    assert response.status_code == 409

    # 3. Approve application
    decision_payload = {"decision": "Approved", "remarks": "Approved for offer"}
    client.patch(
        f"/api/v1/loans/applications/{app_id}/decision?officer_email=officer@example.com",
        json=decision_payload,
    )

    # 4. Make offer exceeding requested amount (should fail with 409)
    invalid_offer_payload = {"offered_amount": 130000.00}
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer?officer_email=officer@example.com",
        json=invalid_offer_payload,
    )
    assert response.status_code == 409

    # 5. Make valid offer
    valid_offer_payload = {"offered_amount": 100000.00}
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer?officer_email=officer@example.com",
        json=valid_offer_payload,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["offer_status"] == "Offer Made"
    assert data["offered_amount"] == 100000.00

    # 6. Get amortization schedule
    response = client.get(f"/api/v1/loans/applications/{app_id}/schedule")
    assert response.status_code == 200
    schedule_data = response.json()
    assert schedule_data["application_id"] == app_id
    schedule = schedule_data["schedule"]
    assert len(schedule) == 12

    # Verify sum of principal components equals offered amount exactly
    total_principal = sum(row["principal"] for row in schedule)
    assert abs(total_principal - 100000.00) < 0.01
    assert schedule[-1]["balance"] == 0.0

    # 7. Accept offer (owning customer)
    decision_payload = {"decision": "Accepted"}
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer-decision",
        json=decision_payload,
        headers={"x-user-email": "test@example.com"},
    )
    assert response.status_code == 204

    # 8. Try to decide already-decided offer (should fail with 409)
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer-decision",
        json=decision_payload,
        headers={"x-user-email": "test@example.com"},
    )
    assert response.status_code == 409


def test_decline_offer_flow():
    # 1. Create and approve application
    payload = {
        "product_id": "11111111-1111-1111-1111-111111111111",
        "customer_id": "00000000-0000-0000-0000-000000000001",
        "requested_amount": 120000.00,
        "tenure_months": 12,
        "monthly_income": 80000.00,
        "employment_type": "salaried",
    }
    create_resp = client.post("/api/v1/loans/applications", json=payload)
    app_id = create_resp.json()["application_id"]

    client.patch(
        f"/api/v1/loans/applications/{app_id}/decision?officer_email=officer@example.com",
        json={"decision": "Approved", "remarks": "Approved"},
    )

    # 2. Make offer
    client.post(
        f"/api/v1/loans/applications/{app_id}/offer?officer_email=officer@example.com",
        json={"offered_amount": 100000.00},
    )

    # 3. Decline offer (should fail if reason is missing)
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer-decision",
        json={"decision": "Declined"},
        headers={"x-user-email": "test@example.com"},
    )
    assert response.status_code == 400

    # 4. Decline offer with reason
    response = client.post(
        f"/api/v1/loans/applications/{app_id}/offer-decision",
        json={"decision": "Declined", "decline_reason": "Interest rate too high"},
        headers={"x-user-email": "test@example.com"},
    )
    assert response.status_code == 204

    # 5. Verify application status moved back to Approved
    response = client.get(
        "/api/v1/customers/00000000-0000-0000-0000-000000000001/applications",
        headers={"x-user-email": "test@example.com"},
    )
    apps = response.json()
    app_record = next(a for a in apps if a["application_id"] == app_id)
    assert app_record["status"] == "Approved"
    assert app_record["offer_status"] == "Declined"
