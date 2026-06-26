from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from server import schemas, crud, models
from server.database import get_db
from server.core.security import require_member, require_librarian

router = APIRouter()


def calculate_loan_details(loan: models.Loan):
    now = datetime.utcnow()
    due_date = loan.due_date
    returned_at = loan.returned_at

    if returned_at:
        status_str = "returned"
        if returned_at > due_date:
            overdue_days = (returned_at - due_date).days
            fine_amount = float(overdue_days * 0.25)
        else:
            fine_amount = 0.0
    else:
        if now > due_date:
            status_str = "overdue"
            overdue_days = (now - due_date).days
            fine_amount = float(overdue_days * 0.25)
        else:
            status_str = "active"
            fine_amount = 0.0

    return fine_amount, status_str


@router.post("/loans/borrow/{book_copy_id}", response_model=schemas.LoanResponse)
def borrow_book(
    book_copy_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_member),
):
    # Check if book copy exists
    copy = crud.get_book_copy_by_id(db, copy_id=book_copy_id)
    if not copy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book copy not found"
        )

    result = crud.borrow_book_copy(
        db, user_id=str(current_user.id), copy_id=book_copy_id
    )
    if result == "not_available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Book copy is not available"
        )
    elif result == "limit_reached":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has reached borrowing limit (5 books)",
        )
    elif not result or isinstance(result, str):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book copy not found"
        )

    fine_amount, _ = calculate_loan_details(result)
    return schemas.LoanResponse(
        id=str(result.id),
        book_copy_id=str(result.book_copy_id),
        user_id=str(result.user_id),
        borrowed_at=result.borrowed_at.isoformat(),
        due_date=result.due_date.isoformat(),
        returned_at=result.returned_at.isoformat() if result.returned_at else None,
        fine_amount=fine_amount,
    )


@router.post("/loans/return/{book_copy_id}", response_model=schemas.LoanResponse)
def return_book(
    book_copy_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_member),
):
    # Check if book copy exists
    copy = crud.get_book_copy_by_id(db, copy_id=book_copy_id)
    if not copy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book copy not found"
        )

    result = crud.return_book_copy(
        db, user_id=str(current_user.id), copy_id=book_copy_id
    )
    if result == "no_active_loan":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book copy is not currently borrowed by this user",
        )
    elif not result or isinstance(result, str):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book copy or active loan not found",
        )

    fine_amount, _ = calculate_loan_details(result)
    return schemas.LoanResponse(
        id=str(result.id),
        book_copy_id=str(result.book_copy_id),
        user_id=str(result.user_id),
        borrowed_at=result.borrowed_at.isoformat(),
        due_date=result.due_date.isoformat(),
        returned_at=result.returned_at.isoformat() if result.returned_at else None,
        fine_amount=fine_amount,
    )


@router.get("/users/me/loans", response_model=List[schemas.UserLoanResponse])
def list_my_loans(
    db: Session = Depends(get_db), current_user: models.User = Depends(require_member)
):
    loans = crud.get_user_loans(db, user_id=str(current_user.id))
    response = []
    for loan in loans:
        fine_amount, status_str = calculate_loan_details(loan)
        book = loan.book_copy.book
        response.append(
            schemas.UserLoanResponse(
                id=str(loan.id),
                book_copy_id=str(loan.book_copy_id),
                borrowed_at=loan.borrowed_at.isoformat(),
                due_date=loan.due_date.isoformat(),
                returned_at=loan.returned_at.isoformat() if loan.returned_at else None,
                fine_amount=fine_amount,
                status=status_str,
                title=str(book.title),
                author=str(book.author),
            )
        )
    return response


@router.get("/loans", response_model=List[schemas.LibrarianLoanResponse])
def list_all_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_librarian),
):
    loans = crud.get_all_loans(db)
    response = []
    for loan in loans:
        fine_amount, status_str = calculate_loan_details(loan)
        book = loan.book_copy.book
        user = loan.user
        response.append(
            schemas.LibrarianLoanResponse(
                id=str(loan.id),
                book_copy_id=str(loan.book_copy_id),
                borrowed_at=loan.borrowed_at.isoformat(),
                due_date=loan.due_date.isoformat(),
                returned_at=loan.returned_at.isoformat() if loan.returned_at else None,
                fine_amount=fine_amount,
                status=status_str,
                title=str(book.title),
                author=str(book.author),
                user_id=str(loan.user_id),
                username=str(user.username) if user else "Unknown",
            )
        )
    return response
