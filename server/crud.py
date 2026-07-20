from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, Tuple, List
from server import models, schemas


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


# Book CRUD
def get_book_by_isbn(db: Session, isbn: str):
    # Clean ISBN first
    cleaned_isbn = isbn.replace("-", "").replace(" ", "")
    return db.query(models.Book).filter(models.Book.isbn == cleaned_isbn).first()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        published_year=book.published_year,
        genre=book.genre,
        total_copies=book.total_copies,
        available_copies=book.available_copies,
        is_available=book.available_copies > 0,
        cover_image_url=book.cover_image_url,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def search_books(
    db: Session,
    query: Optional[str] = None,
    search_by: str = "all",
    title: Optional[str] = None,
    author: Optional[str] = None,
    isbn: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
) -> Tuple[List[models.Book], int]:
    db_query = db.query(models.Book)

    # Apply specific filters if provided
    if title:
        db_query = db_query.filter(models.Book.title.ilike(f"%{title}%"))
    if author:
        db_query = db_query.filter(models.Book.author.ilike(f"%{author}%"))
    if isbn:
        cleaned_isbn = isbn.replace("-", "").replace(" ", "")
        db_query = db_query.filter(models.Book.isbn.ilike(f"%{cleaned_isbn}%"))

    # Apply general query if provided
    if query:
        if search_by == "title":
            db_query = db_query.filter(models.Book.title.ilike(f"%{query}%"))
        elif search_by == "author":
            db_query = db_query.filter(models.Book.author.ilike(f"%{query}%"))
        elif search_by == "isbn":
            cleaned_query = query.replace("-", "").replace(" ", "")
            db_query = db_query.filter(models.Book.isbn.ilike(f"%{cleaned_query}%"))
        else:  # "all"
            cleaned_query = query.replace("-", "").replace(" ", "")
            db_query = db_query.filter(
                or_(
                    models.Book.title.ilike(f"%{query}%"),
                    models.Book.author.ilike(f"%{query}%"),
                    models.Book.isbn.ilike(f"%{cleaned_query}%"),
                )
            )

    total = db_query.count()

    # Pagination
    offset = (page - 1) * limit
    items = db_query.offset(offset).limit(limit).all()

    return items, total
