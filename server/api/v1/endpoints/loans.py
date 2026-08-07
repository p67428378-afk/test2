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
    if not return_date or return_date <= due_date:
        return 0
    overdue_days = (return_date.date() - due_date.date()).days
    return max(0, overdue_days)


@router.get("/loans", response_model=List[schemas.LoanResponse])
def read_all_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "librarian":
        return crud.get_member_loans(
            db, member_id=current_user.id, skip=skip, limit=limit
        )
    return crud.get_loans(db, skip=skip, limit=limit)


@router.get("/members/{member_id}/loans", response_model=List[schemas.LoanResponse])
def read_member_loans(
    member_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "librarian" and current_user.id != member_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this member's loans",
        )
    return crud.get_member_loans(db, member_id=member_id, skip=skip, limit=limit)


@router.post(
    "/loans/checkout",
    response_model=schemas.LoanResponse,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "/loans", response_model=schemas.LoanResponse, status_code=status.HTTP_201_CREATED
)
def checkout_book(
    loan: schemas.LoanCreate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_book = crud.get_book_by_id(db, book_id=loan.book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    if not db_book.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book is not available for loan",
        )
    if db_book.available_copies <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No copies of this book are currently available",
        )

    db_member = crud.get_user_by_id(db, user_id=loan.member_id)
    if not db_member or db_member.role != "member":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Member not found"
        )
    if db_member.membership_status == "SUSPENDED" or not db_member.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Member account is suspended or inactive",
        )

    return crud.create_loan(db, loan=loan)


@router.post("/loans/{loan_id}/return", response_model=schemas.LoanReturnResponse)
def return_book_post(
    loan_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_loan = crud.get_loan_by_id(db, loan_id=loan_id)
    if not db_loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Loan record not found"
        )
    if db_loan.return_date or db_loan.returned_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book has already been returned",
        )

    returned_loan = crud.return_loan(db, db_loan=db_loan)

    ret_date = (
        returned_loan.returned_at or returned_loan.return_date or datetime.utcnow()
    )
    overdue_days = calculate_overdue_days(returned_loan.due_date, ret_date)
    created_fine = None
    if overdue_days > 0:
        fine_amount = min(overdue_days * 0.50, 15.00)
        created_fine = crud.create_fine(
            db,
            loan_id=returned_loan.id,
            amount=fine_amount,
            overdue_days=overdue_days,
            member_id=returned_loan.member_id,
        )

    return {"loan": returned_loan, "fine": created_fine}


@router.put("/loans/{loan_id}/return", response_model=schemas.LoanResponse)
def return_book_put(
    loan_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_loan = crud.get_loan_by_id(db, loan_id=loan_id)
    if not db_loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Loan record not found"
        )
    if db_loan.return_date or db_loan.returned_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book has already been returned",
        )

    returned_loan = crud.return_loan(db, db_loan=db_loan)

    ret_date = (
        returned_loan.returned_at or returned_loan.return_date or datetime.utcnow()
    )
    overdue_days = calculate_overdue_days(returned_loan.due_date, ret_date)
    if overdue_days > 0:
        fine_amount = min(overdue_days * 0.50, 15.00)
        crud.create_fine(
            db,
            loan_id=returned_loan.id,
            amount=fine_amount,
            overdue_days=overdue_days,
            member_id=returned_loan.member_id,
        )

    return returned_loan


@router.post("/loans/reminders", status_code=status.HTTP_200_OK)
@router.post("/reminders/process", status_code=status.HTTP_200_OK)
def send_due_reminders(
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    now = datetime.utcnow()
    active_loans = (
        db.query(models.Loan)
        .filter(models.Loan.return_date.is_(None), models.Loan.returned_at.is_(None))
        .all()
    )

    reminders_sent = []
    for loan in active_loans:
        time_until_due = loan.due_date - now

        if now > loan.due_date and loan.status != "OVERDUE":
            loan.status = "OVERDUE"
            db.commit()

        # Send 48h reminder
        if (
            timedelta(hours=23) <= time_until_due <= timedelta(hours=49)
            and not loan.reminder_48h_sent
        ):
            loan.reminder_48h_sent = True
            db.commit()
            reminders_sent.append(
                {
                    "type": "48h_reminder",
                    "member_email": loan.member.email if loan.member else None,
                    "book_title": loan.book.title if loan.book else None,
                    "due_date": loan.due_date.strftime("%Y-%m-%d"),
                }
            )
        # Send 24h reminder
        elif (
            timedelta(hours=0) <= time_until_due < timedelta(hours=23)
            and not loan.reminder_24h_sent
        ):
            loan.reminder_24h_sent = True
            db.commit()
            reminders_sent.append(
                {
                    "type": "24h_reminder",
                    "member_email": loan.member.email if loan.member else None,
                    "book_title": loan.book.title if loan.book else None,
                    "due_date": loan.due_date.strftime("%Y-%m-%d"),
                }
            )
        elif now > loan.due_date:
            reminders_sent.append(
                {
                    "type": "overdue_alert",
                    "member_email": loan.member.email if loan.member else None,
                    "book_title": loan.book.title if loan.book else None,
                    "due_date": loan.due_date.strftime("%Y-%m-%d"),
                }
            )

    return {"status": "success", "reminders_sent": reminders_sent}
