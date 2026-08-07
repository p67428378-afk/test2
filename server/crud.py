from sqlalchemy.orm import Session
from sqlalchemy import or_
from server import models, schemas
from server.core.security import get_password_hash
from datetime import datetime, timedelta
from typing import Optional
import uuid


def _to_uuid(val):
    if isinstance(val, str):
        return uuid.UUID(val)
    return val


# User CRUD
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=_to_uuid(user_id), otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return (
        db.query(models.OTP).filter(models.OTP.id == _to_uuid(otp_session_id)).first()
    )


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=_to_uuid(user_id), hashed_password=hashed_password
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


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id):
    return db.query(models.User).filter(models.User.id == _to_uuid(user_id)).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.User)
        .filter(models.User.is_active.is_(True))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        membership_status=user.membership_status,
        is_active=user.is_active,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate):
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    elif "password" in update_data:
        update_data.pop("password")
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, db_user: models.User):
    # Soft delete
    db_user.is_active = False
    db_user.membership_status = "SUSPENDED"
    db.commit()
    db.refresh(db_user)
    return db_user


# Book CRUD
def get_book_by_id(db: Session, book_id):
    return db.query(models.Book).filter(models.Book.id == _to_uuid(book_id)).first()


def get_book_by_isbn(db: Session, isbn: str):
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def get_books(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    genre: Optional[str] = None,
    available_only: bool = False,
    include_inactive: bool = False,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Book)
    if not include_inactive:
        query = query.filter(models.Book.is_active.is_(True))
    if search:
        query = query.filter(
            or_(
                models.Book.title.ilike(f"%{search}%"),
                models.Book.author.ilike(f"%{search}%"),
                models.Book.isbn.ilike(f"%{search}%"),
                models.Book.category.ilike(f"%{search}%"),
                models.Book.genre.ilike(f"%{search}%"),
            )
        )
    cat_filter = category or genre
    if cat_filter:
        query = query.filter(
            or_(
                models.Book.category.ilike(f"%{cat_filter}%"),
                models.Book.genre.ilike(f"%{cat_filter}%"),
            )
        )
    if available_only:
        query = query.filter(models.Book.available_copies > 0)

    return query.offset(skip).limit(limit).all()


def create_book(db: Session, book: schemas.BookCreate):
    cat = book.category or book.genre
    gnr = book.genre or book.category
    db_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        category=cat,
        genre=gnr,
        publication_year=book.publication_year,
        total_copies=book.total_copies,
        available_copies=book.total_copies,
        is_active=True,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, db_book: models.Book, book_update: schemas.BookUpdate):
    update_data = book_update.dict(exclude_unset=True)

    if "total_copies" in update_data and update_data["total_copies"] is not None:
        diff = update_data["total_copies"] - db_book.total_copies
        db_book.available_copies = max(0, db_book.available_copies + diff)

    if "category" in update_data and not update_data.get("genre"):
        update_data["genre"] = update_data["category"]
    elif "genre" in update_data and not update_data.get("category"):
        update_data["category"] = update_data["genre"]

    for key, value in update_data.items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, db_book: models.Book):
    # Check if active loans exist for this book
    active_loans = (
        db.query(models.Loan)
        .filter(
            models.Loan.book_id == db_book.id,
            or_(models.Loan.status == "BORROWED", models.Loan.return_date.is_(None)),
        )
        .first()
    )
    if active_loans:
        raise ValueError("Cannot delete book with active loans")

    db_book.is_active = False
    db.commit()
    db.refresh(db_book)
    return db_book


# Loan CRUD
def get_loan_by_id(db: Session, loan_id):
    return db.query(models.Loan).filter(models.Loan.id == _to_uuid(loan_id)).first()


def get_loans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Loan).offset(skip).limit(limit).all()


def get_member_loans(db: Session, member_id, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Loan)
        .filter(models.Loan.member_id == _to_uuid(member_id))
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_loan(db: Session, loan: schemas.LoanCreate):
    now = datetime.utcnow()
    due_date = now + timedelta(days=14)
    db_loan = models.Loan(
        book_id=_to_uuid(loan.book_id),
        member_id=_to_uuid(loan.member_id),
        borrowed_at=now,
        checkout_date=now,
        due_date=due_date,
        status="BORROWED",
        reminder_48h_sent=False,
        reminder_24h_sent=False,
    )
    db.add(db_loan)

    # Decrement available copies of the book
    db_book = get_book_by_id(db, loan.book_id)
    if db_book:
        db_book.available_copies = max(0, db_book.available_copies - 1)

    db.commit()
    db.refresh(db_loan)
    return db_loan


def return_loan(db: Session, db_loan: models.Loan):
    now = datetime.utcnow()
    db_loan.return_date = now
    db_loan.returned_at = now
    db_loan.status = "RETURNED"

    # Increment available copies of the book
    db_book = get_book_by_id(db, db_loan.book_id)
    if db_book:
        db_book.available_copies = min(
            db_book.total_copies, db_book.available_copies + 1
        )

    db.commit()
    db.refresh(db_loan)
    return db_loan


# Fine CRUD
def get_fines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Fine).offset(skip).limit(limit).all()


def get_member_fines(
    db: Session,
    member_id,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Fine).filter(models.Fine.member_id == _to_uuid(member_id))
    if status:
        query = query.filter(models.Fine.status.ilike(f"%{status}%"))
    return query.offset(skip).limit(limit).all()


def create_fine(
    db: Session, loan_id, amount: float, overdue_days: int = 0, member_id=None
):
    # Cap maximum fine at $15.00
    capped_amount = min(float(amount), 15.00)
    db_fine = models.Fine(
        loan_id=_to_uuid(loan_id),
        member_id=_to_uuid(member_id) if member_id else None,
        overdue_days=overdue_days,
        amount=capped_amount,
        status="UNPAID",
    )
    db.add(db_fine)
    db.commit()
    db.refresh(db_fine)
    return db_fine


def pay_fine(db: Session, db_fine: models.Fine):
    db_fine.status = "PAID"
    db_fine.paid_at = datetime.utcnow()
    db.commit()
    db.refresh(db_fine)
    return db_fine


# Inventory Item CRUD
def get_inventory_item_by_id(db: Session, item_id):
    return (
        db.query(models.InventoryItem)
        .filter(models.InventoryItem.item_id == _to_uuid(item_id))
        .first()
    )


def get_inventory_items(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.InventoryItem)
    if search:
        query = query.filter(
            or_(
                models.InventoryItem.name.ilike(f"%{search}%"),
                models.InventoryItem.supplier.ilike(f"%{search}%"),
                models.InventoryItem.category.ilike(f"%{search}%"),
            )
        )
    if category:
        query = query.filter(models.InventoryItem.category.ilike(f"%{category}%"))
    return query.offset(skip).limit(limit).all()


def create_inventory_item(db: Session, item: schemas.InventoryItemCreate):
    db_item = models.InventoryItem(
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        unit=item.unit,
        supplier=item.supplier,
        category=item.category,
        low_stock_threshold=item.low_stock_threshold,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_inventory_item(
    db: Session,
    db_item: models.InventoryItem,
    item_update: schemas.InventoryItemUpdate,
):
    update_data = item_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_inventory_item(db: Session, db_item: models.InventoryItem):
    db.delete(db_item)
    db.commit()
