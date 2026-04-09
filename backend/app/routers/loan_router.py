from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app import schemas
from backend.app.database import get_db
from backend.app.services import loan_service, audit_service

router = APIRouter()

@router.post("/", response_model=schemas.Loan)
def create_loan(loan: schemas.LoanCreate, db: Session = Depends(get_db)):
    return loan_service.create_loan(db=db, loan=loan)

@router.get("/", response_model=List[schemas.Loan])
def read_loans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    loans = loan_service.get_loans(db, skip=skip, limit=limit)
    return loans

@router.get("/{loan_id}", response_model=schemas.Loan)
def read_loan(loan_id: str, db: Session = Depends(get_db)):
    db_loan = loan_service.get_loan(db, loan_id=loan_id)
    if db_loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    return db_loan

@router.post("/{loan_id}/repayment-schedule", response_model=schemas.RepaymentSchedule)
def create_repayment_schedule_for_loan(
    loan_id: str,
    schedule: schemas.RepaymentScheduleCreate,
    db: Session = Depends(get_db)
):
    db_loan = loan_service.get_loan(db, loan_id=loan_id)
    if db_loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    schedule.loan_id = loan_id
    return loan_service.create_repayment_schedule(db=db, schedule=schedule)

@router.post("/{loan_id}/transaction", response_model=schemas.Transaction)
def create_transaction_for_loan(
    loan_id: str,
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db)
):
    db_loan = loan_service.get_loan(db, loan_id=loan_id)
    if db_loan is None:
        raise HTTPException(status_code=404, detail="Loan not found")
    transaction.loan_id = loan_id
    db_transaction = loan_service.create_transaction(db=db, transaction=transaction)

    # After transaction, check payment status and penalties
    loan_service.check_payment_status_and_penalties(db, loan_id)

    # Log the transaction event
    audit_service.create_audit_log(
        db,
        schemas.AuditLogCreate(
            loan_id=loan_id,
            event_type="TRANSACTION_RECORDED",
            entity_id=db_transaction.id,
            new_state=f"Amount Paid: {transaction.amount_paid}",
            actor="system",
            context="API Call",
            hash_signature=""
        )
    )
    return db_transaction

@router.post("/{loan_id}/check-status")
def check_loan_status(
    loan_id: str,
    db: Session = Depends(get_db)
):
    status_info = loan_service.check_payment_status_and_penalties(db, loan_id)
    if status_info is None:
        raise HTTPException(status_code=404, detail="Loan not found")

    # Log the status check event
    audit_service.create_audit_log(
        db,
        schemas.AuditLogCreate(
            loan_id=loan_id,
            event_type="LOAN_STATUS_CHECKED",
            entity_id=loan_id,
            new_state=f"Current Status: {status_info['status']}",
            actor="system",
            context="API Call",
            hash_signature=""
        )
    )
    return status_info
