from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user, get_current_librarian
from typing import List
from uuid import UUID
from datetime import datetime, timedelta
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


def calculate_overdue_days(due_date: datetime, return_date: datetime) -> int:
    if return_date <= due_date:
        return 0

    # Standard holidays (month, day)
    holidays = {
        (1, 1),  # New Year's Day
        (7, 4),  # Independence Day
        (11, 26),  # Thanksgiving
        (12, 25),  # Christmas Day
    }

    overdue_days = 0
    current_date = due_date.date()
    end_date = return_date.date()

    while current_date < end_date:
        current_date += timedelta(days=1)
        # Exclude weekends (Saturday=5, Sunday=6)
        if current_date.weekday() in (5, 6):
            continue
        # Exclude public holidays
        if (current_date.month, current_date.day) in holidays:
            continue
        overdue_days += 1

    return overdue_days


@router.get("/members/{member_id}/loans", response_model=List[schemas.LoanResponse])
def read_member_loans(
    member_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Enforce RBAC: Librarians can view any member's loans. Members can only view their own.
    if current_user.role != "librarian" and current_user.id != member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this member's loans",
        )
    return crud.get_member_loans(db, member_id=member_id, skip=skip, limit=limit)


@router.post(
    "/loans", response_model=schemas.LoanResponse, status_code=status.HTTP_201_CREATED
)
def checkout_book(
    loan: schemas.LoanCreate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    # Check if book exists and has available copies
    db_book = crud.get_book_by_id(db, book_id=loan.book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    if db_book.available_copies <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No copies of this book are currently available",
        )

    # Check if member exists
    db_member = crud.get_user_by_id(db, user_id=loan.member_id)
    if not db_member or db_member.role != "member":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Member not found"
        )

    return crud.create_loan(db, loan=loan)


@router.put("/loans/{loan_id}/return", response_model=schemas.LoanResponse)
def return_book(
    loan_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_loan = crud.get_loan_by_id(db, loan_id=loan_id)
    if not db_loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Loan record not found"
        )
    if db_loan.return_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book has already been returned",
        )

    # Mark as returned
    returned_loan = crud.return_loan(db, db_loan=db_loan)

    # Calculate fine if overdue
    overdue_days = calculate_overdue_days(
        returned_loan.due_date, returned_loan.return_date
    )
    if overdue_days > 0:
        fine_amount = overdue_days * 0.25
        crud.create_fine(db, loan_id=returned_loan.id, amount=fine_amount)

    return returned_loan


@router.post("/loans/reminders", status_code=status.HTTP_200_OK)
def send_due_reminders(
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    # Find loans due exactly 3 days from now
    target_date = (datetime.utcnow() + timedelta(days=3)).date()

    # Query active loans
    active_loans = db.query(models.Loan).filter(models.Loan.return_date.is_(None)).all()

    reminders_sent = []
    for loan in active_loans:
        if loan.due_date.date() == target_date:
            # Send email reminder (mocked)
            member = loan.member
            book = loan.book
            email_body = f"Hi {member.full_name}, this is a reminder that '{book.title}' is due on {loan.due_date.strftime('%Y-%m-%d')}."
            logger.info(f"Sending email to {member.email}: {email_body}")
            reminders_sent.append(
                {
                    "member_email": member.email,
                    "book_title": book.title,
                    "due_date": loan.due_date.strftime("%Y-%m-%d"),
                }
            )

    return {"status": "success", "reminders_sent": reminders_sent}
