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


# --- Book Catalog Functions ---


def validate_isbn_format(isbn: str) -> str:
    # Check if it contains only digits and hyphens
    if not all(c.isdigit() or c == "-" for c in isbn):
        raise ValueError("Invalid ISBN format: must only contain digits and hyphens")
    cleaned = isbn.replace("-", "")
    if len(cleaned) != 13:
        raise ValueError("Invalid ISBN format: must be exactly 13 digits")
    return cleaned


def get_book_by_isbn(db: Session, isbn: str):
    try:
        cleaned_isbn = validate_isbn_format(isbn)
    except ValueError:
        return None
    return db.query(models.Book).filter(models.Book.isbn == cleaned_isbn).first()


def create_book(db: Session, book_in: schemas.BookCreate):
    cleaned_isbn = validate_isbn_format(book_in.isbn)

    existing_book = (
        db.query(models.Book).filter(models.Book.isbn == cleaned_isbn).first()
    )
    if existing_book:
        raise ValueError("Book with this ISBN already exists")

    db_book = models.Book(
        title=book_in.title,
        author=book_in.author,
        isbn=cleaned_isbn,
        published_year=book_in.published_year,
        genre=book_in.genre,
        total_copies=book_in.total_copies,
        available_copies=book_in.available_copies,
        is_available=book_in.available_copies > 0,
        cover_image_url=book_in.cover_image_url,
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
) -> Tuple[List[models.Book], int, int]:
    q = db.query(models.Book)

    if title:
        q = q.filter(models.Book.title.ilike(f"%{title}%"))
    if author:
        q = q.filter(models.Book.author.ilike(f"%{author}%"))
    if isbn:
        cleaned_isbn = validate_isbn_format(isbn)
        q = q.filter(models.Book.isbn == cleaned_isbn)

    if query:
        search_by_lower = search_by.lower()
        if search_by_lower == "title":
            q = q.filter(models.Book.title.ilike(f"%{query}%"))
        elif search_by_lower == "author":
            q = q.filter(models.Book.author.ilike(f"%{query}%"))
        elif search_by_lower == "isbn":
            cleaned_isbn = validate_isbn_format(query)
            q = q.filter(models.Book.isbn == cleaned_isbn)
        else:  # "all"
            conditions = [
                models.Book.title.ilike(f"%{query}%"),
                models.Book.author.ilike(f"%{query}%"),
            ]
            cleaned_query = query.replace("-", "")
            if cleaned_query.isdigit() and len(cleaned_query) == 13:
                conditions.append(models.Book.isbn == cleaned_query)
            else:
                conditions.append(models.Book.isbn.ilike(f"%{query}%"))
            q = q.filter(or_(*conditions))

    total = q.count()
    pages = (total + limit - 1) // limit if total > 0 else 1
    offset = (page - 1) * limit
    items = q.offset(offset).limit(limit).all()

    return items, total, pages
