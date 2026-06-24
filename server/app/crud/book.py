from sqlalchemy.orm import Session
from sqlalchemy import or_
from server.app.models.book import Book
from server.app.schemas.book import BookCreate


def get_book_by_isbn(db: Session, isbn: str):
    return db.query(Book).filter(Book.isbn == isbn).first()


def create_book(db: Session, book_in: BookCreate):
    db_book = Book(
        title=book_in.title,
        author=book_in.author or "",
        isbn=book_in.isbn,
        publication_date=book_in.publication_date,
        status="Available",
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_books(db: Session, skip: int = 0, limit: int = 20, search: str = None):
    query = db.query(Book)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Book.title.ilike(search_filter),
                Book.author.ilike(search_filter),
                Book.isbn.ilike(search_filter),
            )
        )
    return query.offset(skip).limit(limit).all()
