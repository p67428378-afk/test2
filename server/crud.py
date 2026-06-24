from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from server import models, schemas
import uuid


# Existing Password Reset CRUD
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# New Library Management System CRUD


# Books
def get_book(db: Session, book_id: str):
    try:
        book_uuid = uuid.UUID(book_id)
    except ValueError:
        return None
    return db.query(models.Book).filter(models.Book.id == book_uuid).first()


def get_book_by_isbn(db: Session, isbn: str):
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def get_books(db: Session, skip: int = 0, limit: int = 100, search: str = None):
    query = db.query(models.Book)
    if search:
        query = query.filter(
            or_(
                models.Book.title.ilike(f"%{search}%"),
                models.Book.author.ilike(f"%{search}%"),
                models.Book.isbn.ilike(f"%{search}%"),
                models.Book.category.ilike(f"%{search}%"),
            )
        )
    return query.offset(skip).limit(limit).all()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        category=book.category,
        copies_total=book.copies_total,
        copies_available=book.copies_total,
        status="available",
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, book_id: str, book_data: schemas.BookUpdate):
    db_book = get_book(db, book_id)
    if not db_book:
        return None

    # Calculate new copies_available
    diff = book_data.copies_total - db_book.copies_total
    new_copies_available = db_book.copies_available + diff
    if new_copies_available < 0:
        new_copies_available = 0

    db_book.title = book_data.title
    db_book.author = book_data.author
    db_book.isbn = book_data.isbn
    db_book.category = book_data.category
    db_book.copies_total = book_data.copies_total
    db_book.copies_available = new_copies_available
    db_book.status = "available" if new_copies_available > 0 else "checked_out"

    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: str):
    db_book = get_book(db, book_id)
    if not db_book:
        return False
    db.delete(db_book)
    db.commit()
    return True


# Patrons
def get_patron(db: Session, patron_id: str):
    try:
        patron_uuid = uuid.UUID(patron_id)
    except ValueError:
        return None
    return db.query(models.Patron).filter(models.Patron.id == patron_uuid).first()


def get_patron_by_username(db: Session, username: str):
    return db.query(models.Patron).filter(models.Patron.username == username).first()


def get_patron_by_email(db: Session, email: str):
    return db.query(models.Patron).filter(models.Patron.email == email).first()


def get_patrons(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patron).offset(skip).limit(limit).all()


def create_patron(db: Session, patron: schemas.PatronCreate, hashed_password: str):
    db_patron = models.Patron(
        username=patron.username,
        email=patron.email,
        hashed_password=hashed_password,
        full_name=patron.full_name,
        mobile_number=patron.mobile_number,
    )
    db.add(db_patron)
    db.commit()
    db.refresh(db_patron)
    return db_patron


# Loans/Circulation
def get_active_loan_by_book(db: Session, book_id: str):
    try:
        book_uuid = uuid.UUID(book_id)
    except ValueError:
        return None
    return (
        db.query(models.Loan)
        .filter(models.Loan.book_id == book_uuid, models.Loan.status == "active")
        .first()
    )


def get_active_loans_by_patron(db: Session, patron_id: str):
    try:
        patron_uuid = uuid.UUID(patron_id)
    except ValueError:
        return []
    return (
        db.query(models.Loan)
        .filter(models.Loan.patron_id == patron_uuid, models.Loan.status == "active")
        .all()
    )


def create_loan(db: Session, patron_id: str, book_id: str, due_date: datetime):
    patron_uuid = uuid.UUID(patron_id)
    book_uuid = uuid.UUID(book_id)

    db_loan = models.Loan(
        patron_id=patron_uuid, book_id=book_uuid, due_date=due_date, status="active"
    )
    db.add(db_loan)

    # Update book copies_available
    db_book = db.query(models.Book).filter(models.Book.id == book_uuid).first()
    if db_book:
        db_book.copies_available -= 1
        if db_book.copies_available <= 0:
            db_book.status = "checked_out"

    db.commit()
    db.refresh(db_loan)
    return db_loan


def return_loan(db: Session, loan: models.Loan):
    loan.return_date = datetime.utcnow()
    loan.status = "returned"

    # Update book copies_available
    db_book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    if db_book:
        db_book.copies_available += 1
        db_book.status = "available"

    db.commit()
    db.refresh(loan)
    return loan


def get_circulation_report(db: Session):
    total_loans = db.query(models.Loan).count()
    active_loans = db.query(models.Loan).filter(models.Loan.status == "active").count()

    # Overdue loans are active loans where due_date < current_time
    now = datetime.utcnow()
    overdue_loans = (
        db.query(models.Loan)
        .filter(models.Loan.status == "active", models.Loan.due_date < now)
        .count()
    )

    return {
        "active_loans": active_loans,
        "overdue_loans": overdue_loans,
        "total_loans": total_loans,
    }
