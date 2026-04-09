from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import pytest

from backend.app import schemas
from backend.app.main import app
from backend.app.services import loan_service, audit_service

# The client fixture is provided by conftest.py

def test_create_loan_api(client: TestClient, session: Session):
    loan_data = {
        "borrower_id": "api_borrower_1",
        "loan_amount": 5000.0,
        "interest_rate": 0.06,
        "term": "6 months",
        "end_date": (datetime.now() + timedelta(days=180)).isoformat()
    }
    response = client.post("/loans/", json=loan_data)
    assert response.status_code == 200
    assert response.json()["borrower_id"] == "api_borrower_1"
    assert response.json()["current_status"] == "ON_TIME"

def test_read_loans_api(client: TestClient, session: Session):
    response = client.get("/loans/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_loan_api(client: TestClient, session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="api_borrower_2",
        loan_amount=2000.0,
        interest_rate=0.07,
        term="3 months",
        end_date=datetime.now() + timedelta(days=90)
    )
    created_loan = loan_service.create_loan(session, loan_data)

    response = client.get(f"/loans/{created_loan.id}")
    assert response.status_code == 200
    assert response.json()["id"] == created_loan.id

def test_create_repayment_schedule_api(client: TestClient, session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="api_borrower_3",
        loan_amount=3000.0,
        interest_rate=0.05,
        term="4 months",
        end_date=datetime.now() + timedelta(days=120)
    )
    created_loan = loan_service.create_loan(session, loan_data)

    schedule_data = {
        "loan_id": created_loan.id,
        "due_date": (datetime.now() + timedelta(days=30)).isoformat(),
        "scheduled_amount": 750.0
    }
    response = client.post(f"/loans/{created_loan.id}/repayment-schedule", json=schedule_data)
    assert response.status_code == 200
    assert response.json()["loan_id"] == created_loan.id
    assert response.json()["scheduled_amount"] == 750.0

def test_create_transaction_api(client: TestClient, session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="api_borrower_4",
        loan_amount=4000.0,
        interest_rate=0.06,
        term="5 months",
        end_date=datetime.now() + timedelta(days=150)
    )
    created_loan = loan_service.create_loan(session, loan_data)

    transaction_data = {
        "loan_id": created_loan.id,
        "amount_paid": 800.0,
        "payment_method": "Credit Card",
        "payment_date": datetime.now().isoformat()
    }
    response = client.post(f"/loans/{created_loan.id}/transaction", json=transaction_data)
    assert response.status_code == 200
    assert response.json()["loan_id"] == created_loan.id
    assert response.json()["amount_paid"] == 800.0

def test_check_loan_status_api(client: TestClient, session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="api_borrower_5",
        loan_amount=1000.0,
        interest_rate=0.05,
        term="1 month",
        end_date=datetime.now() + timedelta(days=30)
    )
    created_loan = loan_service.create_loan(session, loan_data)

    # Define a consistent 'now' for due_date and payment_date to avoid flakiness
    current_time = datetime.now()

    schedule_data = schemas.RepaymentScheduleCreate(
        loan_id=created_loan.id,
        due_date=current_time, # Use consistent time
        scheduled_amount=1000.0
    )
    loan_service.create_repayment_schedule(session, schedule_data)

    transaction_data = schemas.TransactionCreate(
        loan_id=created_loan.id,
        amount_paid=1000.0,
        payment_method="Bank Transfer",
        payment_date=current_time.isoformat() # Use consistent time
    )
    loan_service.create_transaction(session, transaction_data)

    response = client.post(f"/loans/{created_loan.id}/check-status")
    assert response.status_code == 200
    assert response.json()["status"] == "ON_TIME"
    assert response.json()["total_penalties"] == 0.0

def test_read_audit_logs_api(client: TestClient, session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="api_borrower_6",
        loan_amount=1000.0,
        interest_rate=0.05,
        term="1 month",
        end_date=datetime.now() + timedelta(days=30)
    )
    created_loan = loan_service.create_loan(session, loan_data)

    audit_log_data = schemas.AuditLogCreate(
        loan_id=created_loan.id,
        event_type="LOAN_CREATED",
        entity_id=created_loan.id,
        old_state="None",
        new_state="ON_TIME",
        actor="test_user",
        context="API Call",
        hash_signature=""
    )
    audit_service.create_audit_log(session, audit_log_data)

    response = client.get(f"/audit/{created_loan.id}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
    assert response.json()[0]["loan_id"] == created_loan.id
