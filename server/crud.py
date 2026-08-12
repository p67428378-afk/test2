from sqlalchemy.orm import Session
from sqlalchemy import or_
from server import models, schemas
from server.core.security import get_password_hash
from datetime import datetime, timedelta
import uuid


# Helper to convert string to UUID if needed
def _to_uuid(val):
    if isinstance(val, str):
        return uuid.UUID(val)
    return val


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


# Library Management System CRUD


# User CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id):
    return db.query(models.User).filter(models.User.id == _to_uuid(user_id)).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate):
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    for key, value in update_data.items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


# Book CRUD
def get_book_by_id(db: Session, book_id):
    return db.query(models.Book).filter(models.Book.id == _to_uuid(book_id)).first()


def get_book_by_isbn(db: Session, isbn: str):
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def get_books(
    db: Session, search: str = None, genre: str = None, skip: int = 0, limit: int = 100
):
    query = db.query(models.Book)
    if search:
        query = query.filter(
            or_(
                models.Book.title.ilike(f"%{search}%"),
                models.Book.author.ilike(f"%{search}%"),
                models.Book.isbn.ilike(f"%{search}%"),
            )
        )
    if genre:
        query = query.filter(models.Book.genre.ilike(f"%{genre}%"))
    return query.offset(skip).limit(limit).all()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        genre=book.genre,
        publication_year=book.publication_year,
        total_copies=book.total_copies,
        available_copies=book.total_copies,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, db_book: models.Book, book_update: schemas.BookUpdate):
    update_data = book_update.dict(exclude_unset=True)

    # If total_copies is updated, adjust available_copies accordingly
    if "total_copies" in update_data:
        diff = update_data["total_copies"] - db_book.total_copies
        db_book.available_copies = max(0, db_book.available_copies + diff)

    for key, value in update_data.items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, db_book: models.Book):
    db.delete(db_book)
    db.commit()


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
    # Set due date to 14 days from now
    due_date = datetime.utcnow() + timedelta(days=14)
    db_loan = models.Loan(
        book_id=_to_uuid(loan.book_id),
        member_id=_to_uuid(loan.member_id),
        due_date=due_date,
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
    db_loan.return_date = datetime.utcnow()

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


def create_fine(db: Session, loan_id, amount: float):
    db_fine = models.Fine(
        loan_id=_to_uuid(loan_id), amount=amount, status="outstanding"
    )
    db.add(db_fine)
    db.commit()
    db.refresh(db_fine)
    return db_fine


def pay_fine(db: Session, db_fine: models.Fine):
    db_fine.status = "paid"
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
    search: str = None,
    category: str = None,
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


# Vintage Clock CRUD (SCRUM-49)
def get_alarm_by_id(db: Session, alarm_id):
    return db.query(models.Alarm).filter(models.Alarm.id == _to_uuid(alarm_id)).first()


def get_alarms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Alarm).offset(skip).limit(limit).all()


def create_alarm(db: Session, alarm: schemas.AlarmCreate):
    db_alarm = models.Alarm(
        time=alarm.time,
        label=alarm.label,
        enabled=alarm.enabled,
        repeat_days=alarm.repeat_days,
        sound_type=alarm.sound_type,
        snooze_duration_minutes=alarm.snooze_duration_minutes,
    )
    db.add(db_alarm)
    db.commit()
    db.refresh(db_alarm)
    return db_alarm


def update_alarm(
    db: Session, db_alarm: models.Alarm, alarm_update: schemas.AlarmUpdate
):
    update_data = alarm_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_alarm, key, value)
    db.commit()
    db.refresh(db_alarm)
    return db_alarm


def delete_alarm(db: Session, db_alarm: models.Alarm):
    db.delete(db_alarm)
    db.commit()


def get_user_settings(db: Session):
    settings = db.query(models.UserSettings).first()
    if not settings:
        settings = models.UserSettings(
            clock_mode="flip",
            theme_id="antique_brass",
            time_format="12h",
            show_second_hand=True,
            time_zone="UTC",
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_user_settings(db: Session, settings_update: schemas.UserSettingsUpdate):
    settings = get_user_settings(db)
    update_data = settings_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings
