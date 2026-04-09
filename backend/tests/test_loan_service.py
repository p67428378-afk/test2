from datetime import datetime, timedelta
import pytest
from sqlalchemy.orm import Session

from backend.app import models, schemas
from backend.app.services import loan_service

def test_create_loan(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower123",
        loan_amount=10000.0,
        interest_rate=0.05,
        term="12 months",
        end_date=datetime.now() + timedelta(days=365)
    )
    loan = loan_service.create_loan(session, loan_data)
    assert loan.borrower_id == "borrower123"
    assert loan.loan_amount == 10000.0
    assert loan.current_status == "ON_TIME"

def test_get_loan(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower123",
        loan_amount=10000.0,
        interest_rate=0.05,
        term="12 months",
        end_date=datetime.now() + timedelta(days=365)
    )
    created_loan = loan_service.create_loan(session, loan_data)
    fetched_loan = loan_service.get_loan(session, created_loan.id)
    assert fetched_loan.id == created_loan.id

def test_update_loan_status(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower123",
        loan_amount=10000.0,
        interest_rate=0.05,
        term="12 months",
        end_date=datetime.now() + timedelta(days=365)
    )
    created_loan = loan_service.create_loan(session, loan_data)
    updated_loan = loan_service.update_loan_status(session, created_loan.id, "DELAYED")
    assert updated_loan.current_status == "DELAYED"

def test_create_repayment_schedule(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower123",
        loan_amount=10000.0,
        interest_rate=0.05,
        term="12 months",
        end_date=datetime.now() + timedelta(days=365)
    )
    created_loan = loan_service.create_loan(session, loan_data)
    schedule_data = schemas.RepaymentScheduleCreate(
        loan_id=created_loan.id,
        due_date=datetime.now() + timedelta(days=30),
        scheduled_amount=1000.0
    )
    schedule = loan_service.create_repayment_schedule(session, schedule_data)
    assert schedule.loan_id == created_loan.id
    assert schedule.scheduled_amount == 1000.0
    assert schedule.status == "SCHEDULED"

def test_create_transaction(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower123",
        loan_amount=10000.0,
        interest_rate=0.05,
        term="12 months",
        end_date=datetime.now() + timedelta(days=365)
    )
    created_loan = loan_service.create_loan(session, loan_data)
    transaction_data = schemas.TransactionCreate(
        loan_id=created_loan.id,
        amount_paid=1000.0,
        payment_method="Bank Transfer",
        payment_date=datetime.now()
    )
    transaction = loan_service.create_transaction(session, transaction_data)
    assert transaction.loan_id == created_loan.id
    assert transaction.amount_paid == 1000.0

def test_check_payment_status_on_time(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower_on_time",
        loan_amount=1000.0,
        interest_rate=0.05,
        term="1 month",
        end_date=datetime.now() + timedelta(days=30)
    )
    loan = loan_service.create_loan(session, loan_data)

    # Set due date in the future, and payment date before or on due date
    due_date = datetime.now() + timedelta(days=5)
    payment_date = due_date - timedelta(days=1)

    schedule_data = schemas.RepaymentScheduleCreate(
        loan_id=loan.id,
        due_date=due_date,
        scheduled_amount=1000.0
    )
    loan_service.create_repayment_schedule(session, schedule_data)

    transaction_data = schemas.TransactionCreate(
        loan_id=loan.id,
        amount_paid=1000.0,
        payment_method="Bank Transfer",
        payment_date=payment_date
    )
    loan_service.create_transaction(session, transaction_data)

    result = loan_service.check_payment_status_and_penalties(session, loan.id)
    assert result["status"] == "ON_TIME"
    assert result["total_penalties"] == 0.0

def test_check_payment_status_delayed(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower_delayed",
        loan_amount=1000.0,
        interest_rate=0.05,
        term="1 month",
        end_date=datetime.now() + timedelta(days=30)
    )
    loan = loan_service.create_loan(session, loan_data)

    # Set due date in the past, and payment date within delayed window
    due_date = datetime.now() - timedelta(days=5)
    payment_date = datetime.now() - timedelta(days=2) # 3 days late

    schedule_data = schemas.RepaymentScheduleCreate(
        loan_id=loan.id,
        due_date=due_date,
        scheduled_amount=1000.0
    )
    loan_service.create_repayment_schedule(session, schedule_data)

    transaction_data = schemas.TransactionCreate(
        loan_id=loan.id,
        amount_paid=1000.0,
        payment_method="Bank Transfer",
        payment_date=payment_date
    )
    loan_service.create_transaction(session, transaction_data)

    result = loan_service.check_payment_status_and_penalties(session, loan.id)
    assert result["status"] == "DELAYED"
    assert result["total_penalties"] > 0.0

def test_check_payment_status_default(session: Session):
    loan_data = schemas.LoanCreate(
        borrower_id="borrower_default",
        loan_amount=1000.0,
        interest_rate=0.05,
        term="1 month",
        end_date=datetime.now() + timedelta(days=30)
    )
    loan = loan_service.create_loan(session, loan_data)

    # Set due date far in the past, no transaction
    schedule_data = schemas.RepaymentScheduleCreate(
        loan_id=loan.id,
        due_date=datetime.now() - timedelta(days=12),
        scheduled_amount=1000.0
    )
    loan_service.create_repayment_schedule(session, schedule_data)

    result = loan_service.check_payment_status_and_penalties(session, loan.id)
    assert result["status"] == "DEFAULT"
    assert result["total_penalties"] > 0.0
