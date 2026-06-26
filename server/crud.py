from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional
import uuid
from server import models, schemas
from server.core.security import get_password_hash
from server.core.config import settings


# --- Legacy CRUD for Password Reset ---
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=uuid.UUID(user_id), otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return (
        db.query(models.OTP).filter(models.OTP.id == uuid.UUID(otp_session_id)).first()
    )


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True  # type: ignore
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=uuid.UUID(user_id), hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# --- Library Management System CRUD ---


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: schemas.UserRegisterRequest):
    hashed_password = get_password_hash(user_in.password)
    db_user = models.User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hashed_password,
        role=user_in.role,
        # Also populate legacy fields to keep database constraints happy if any
        login_id=user_in.username,
        mobile_number=f"0000000000_{user_in.username}",  # unique dummy
        hashed_password=hashed_password,
        security_question="dummy",
        security_answer_hash="dummy",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_books(
    db: Session, search: Optional[str] = None, skip: int = 0, limit: int = 20
):
    query = db.query(models.Book)
    if search:
        query = query.filter(
            or_(
                models.Book.title.icontains(search),
                models.Book.author.icontains(search),
                models.Book.isbn.icontains(search),
            )
        )
    return query.offset(skip).limit(limit).all()


def get_book_by_id(db: Session, book_id: str):
    return db.query(models.Book).filter(models.Book.id == uuid.UUID(book_id)).first()


def get_book_by_isbn(db: Session, isbn: str):
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def create_book(db: Session, book_in: schemas.BookCreateRequest):
    db_book = models.Book(
        title=book_in.title,
        author=book_in.author,
        isbn=book_in.isbn,
        published_date=book_in.published_date,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)

    # Create initial copies
    for _ in range(book_in.initial_copies):
        copy = models.BookCopy(book_id=db_book.id, status="available")
        db.add(copy)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_book_copy_by_id(db: Session, copy_id: str):
    return (
        db.query(models.BookCopy)
        .filter(models.BookCopy.id == uuid.UUID(copy_id))
        .first()
    )


def get_active_loans_count_for_user(db: Session, user_id: str) -> int:
    return (
        db.query(models.Loan)
        .filter(
            models.Loan.user_id == uuid.UUID(user_id), models.Loan.returned_at.is_(None)
        )
        .count()
    )


def borrow_book_copy(db: Session, user_id: str, copy_id: str):
    # Concurrency handling: lock the book copy row for update
    copy = (
        db.query(models.BookCopy)
        .filter(models.BookCopy.id == uuid.UUID(copy_id))
        .with_for_update()
        .first()
    )
    if not copy:
        return None
    if copy.status != "available":
        return "not_available"

    # Check borrowing limit
    active_loans = get_active_loans_count_for_user(db, user_id)
    if active_loans >= settings.BORROWING_LIMIT:
        return "limit_reached"

    # Create loan
    borrowed_at = datetime.utcnow()
    due_date = borrowed_at + timedelta(days=settings.LOAN_PERIOD_DAYS)

    db_loan = models.Loan(
        book_copy_id=copy.id,
        user_id=uuid.UUID(user_id),
        borrowed_at=borrowed_at,
        due_date=due_date,
        fine_amount=Decimal("0.00"),
    )
    copy.status = "borrowed"  # type: ignore
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan


def return_book_copy(db: Session, user_id: str, copy_id: str):
    # Concurrency handling: lock the book copy row for update
    copy = (
        db.query(models.BookCopy)
        .filter(models.BookCopy.id == uuid.UUID(copy_id))
        .with_for_update()
        .first()
    )
    if not copy:
        return None

    # Find active loan for this copy and user
    loan = (
        db.query(models.Loan)
        .filter(
            models.Loan.book_copy_id == uuid.UUID(copy_id),
            models.Loan.user_id == uuid.UUID(user_id),
            models.Loan.returned_at.is_(None),
        )
        .first()
    )

    if not loan:
        return "no_active_loan"

    returned_at = datetime.utcnow()
    loan.returned_at = returned_at  # type: ignore

    # Calculate fine
    if returned_at > loan.due_date:
        overdue_days = (returned_at - loan.due_date).days
        fine = Decimal(str(overdue_days * settings.OVERDUE_FINE_PER_DAY))
        loan.fine_amount = fine  # type: ignore
    else:
        loan.fine_amount = Decimal("0.00")  # type: ignore

    copy.status = "available"  # type: ignore
    db.commit()
    db.refresh(loan)
    return loan


def get_user_loans(db: Session, user_id: str):
    return db.query(models.Loan).filter(models.Loan.user_id == uuid.UUID(user_id)).all()


def get_all_loans(db: Session):
    return db.query(models.Loan).all()
