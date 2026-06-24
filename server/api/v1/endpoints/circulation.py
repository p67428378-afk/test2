from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from server import crud, schemas
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_librarian

router = APIRouter()


def parse_datetime(dt_str: str) -> datetime:
    if dt_str.endswith("Z"):
        dt_str = dt_str[:-1] + "+00:00"
    try:
        return datetime.fromisoformat(dt_str)
    except ValueError:
        try:
            return datetime.strptime(dt_str, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400, detail="Invalid date format. Use ISO 8601."
            )


@router.post("/circulation/checkout", response_model=schemas.CheckoutResponse)
def checkout_book(
    request: schemas.CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    # Smart lookup for book: try UUID first, then ISBN (barcode)
    db_book = None
    try:
        book_uuid = uuid.UUID(request.book_id)
        db_book = crud.get_book(db, book_id=str(book_uuid))
    except ValueError:
        db_book = crud.get_book_by_isbn(db, isbn=request.book_id)

    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Smart lookup for patron: try UUID first, then username or email
    db_patron = None
    try:
        patron_uuid = uuid.UUID(request.patron_id)
        db_patron = crud.get_patron(db, patron_id=str(patron_uuid))
    except ValueError:
        db_patron = crud.get_patron_by_username(db, username=request.patron_id)
        if not db_patron:
            db_patron = crud.get_patron_by_email(db, email=request.patron_id)

    if not db_patron:
        raise HTTPException(status_code=404, detail="Patron not found")

    if db_book.copies_available <= 0:
        raise HTTPException(status_code=400, detail="Book not available")

    active_loans = crud.get_active_loans_by_patron(db, patron_id=str(db_patron.id))
    if len(active_loans) >= 5:
        raise HTTPException(status_code=400, detail="Patron has too many loans")

    due_date = parse_datetime(request.due_date)

    loan = crud.create_loan(
        db, patron_id=str(db_patron.id), book_id=str(db_book.id), due_date=due_date
    )

    return {
        "id": str(loan.id),
        "book_id": str(loan.book_id),
        "patron_id": str(loan.patron_id),
        "checkout_date": loan.checkout_date.isoformat(),
        "due_date": loan.due_date.isoformat(),
        "status": loan.status,
    }


@router.post("/circulation/checkin", response_model=schemas.CheckinResponse)
def checkin_book(
    request: schemas.CheckinRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    # Smart lookup for book: try UUID first, then ISBN (barcode)
    db_book = None
    try:
        book_uuid = uuid.UUID(request.book_id)
        db_book = crud.get_book(db, book_id=str(book_uuid))
    except ValueError:
        db_book = crud.get_book_by_isbn(db, isbn=request.book_id)

    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    loan = crud.get_active_loan_by_book(db, book_id=str(db_book.id))
    if not loan:
        raise HTTPException(status_code=400, detail="Book is not checked out")

    returned_loan = crud.return_loan(db, loan=loan)

    return {
        "id": str(returned_loan.id),
        "book_id": str(returned_loan.book_id),
        "patron_id": str(returned_loan.patron_id),
        "checkout_date": returned_loan.checkout_date.isoformat(),
        "due_date": returned_loan.due_date.isoformat(),
        "return_date": returned_loan.return_date.isoformat()
        if returned_loan.return_date
        else None,
        "status": returned_loan.status,
    }
