from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional

from backend.app import models, schemas

def get_loan(db: Session, loan_id: str):
    return db.query(models.Loan).filter(models.Loan.id == loan_id).first()

def get_loans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Loan).offset(skip).limit(limit).all()

def create_loan(db: Session, loan: schemas.LoanCreate):
    db_loan = models.Loan(**loan.model_dump())
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def update_loan_status(db: Session, loan_id: str, new_status: str):
    db_loan = get_loan(db, loan_id)
    if db_loan:
        db_loan.current_status = new_status
        db.commit()
        db.refresh(db_loan)
    return db_loan

def create_repayment_schedule(db: Session, schedule: schemas.RepaymentScheduleCreate):
    db_schedule = models.RepaymentSchedule(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def get_repayment_schedules_for_loan(db: Session, loan_id: str):
    return db.query(models.RepaymentSchedule).filter(models.RepaymentSchedule.loan_id == loan_id).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions_for_loan(db: Session, loan_id: str):
    return db.query(models.Transaction).filter(models.Transaction.loan_id == loan_id).all()

def calculate_penalty(db: Session, loan_id: str, transaction_id: Optional[str], penalty_type: str, amount: float, reason: str):
    db_penalty = models.Penalty(
        loan_id=loan_id,
        transaction_id=transaction_id,
        penalty_type=penalty_type,
        amount=amount,
        reason=reason
    )
    db.add(db_penalty)
    db.commit()
    db.refresh(db_penalty)
    return db_penalty

def check_payment_status_and_penalties(db: Session, loan_id: str):
    loan = get_loan(db, loan_id)
    if not loan:
        return None

    schedules = get_repayment_schedules_for_loan(db, loan_id)
    transactions = get_transactions_for_loan(db, loan_id)

    current_loan_status = "ON_TIME"
    total_penalties = 0.0

    for schedule in schedules:
        # Find if there's a transaction for this schedule
        paid_on_time = False
        paid_delayed = False
        payment_date = None

        for transaction in transactions:
            # Simple check: if transaction amount matches scheduled amount and is around due date
            # A more robust system would link transactions to specific schedule entries
            if transaction.amount_paid >= schedule.scheduled_amount * 0.95 and \
               transaction.payment_date >= schedule.due_date - timedelta(days=5) and \
               transaction.payment_date <= schedule.due_date + timedelta(days=15):
                payment_date = transaction.payment_date
                if payment_date <= schedule.due_date:
                    paid_on_time = True
                elif payment_date <= schedule.due_date + timedelta(days=10):
                    paid_delayed = True
                break

        if not paid_on_time and not paid_delayed and schedule.due_date < datetime.now():
            # Payment is missed and due date is in the past
            days_late = (datetime.now() - schedule.due_date).days
            if days_late > 10:
                current_loan_status = "DEFAULT"
                # Example: Higher penalty for default
                penalty_amount = schedule.scheduled_amount * 0.05 # 5% of scheduled amount
                calculate_penalty(db, loan_id, None, "DEFAULT_RATE", penalty_amount, f"Payment defaulted, {days_late} days late")
                total_penalties += penalty_amount
            elif days_late > 0:
                if current_loan_status != "DEFAULT": # Default takes precedence
                    current_loan_status = "DELAYED"
                # Example: Flat fee for delayed payment
                penalty_amount = schedule.scheduled_amount * 0.01 # 1% of scheduled amount
                calculate_penalty(db, loan_id, None, "DELAYED_FEE", penalty_amount, f"Payment delayed, {days_late} days late")
                total_penalties += penalty_amount
        elif paid_delayed:
            if current_loan_status != "DEFAULT": # Default takes precedence
                current_loan_status = "DELAYED"
            # Penalty for delayed payment already applied during transaction processing or here if not yet
            # For simplicity, assuming penalty is calculated here if not already.
            days_late = (payment_date - schedule.due_date).days
            penalty_amount = schedule.scheduled_amount * 0.01 # 1% of scheduled amount
            calculate_penalty(db, loan_id, None, "DELAYED_FEE", penalty_amount, f"Payment received {days_late} days late")
            total_penalties += penalty_amount

    # Update loan status if it has changed
    if loan.current_status != current_loan_status:
        update_loan_status(db, loan_id, current_loan_status)

    return {"loan_id": loan_id, "status": current_loan_status, "total_penalties": total_penalties}
