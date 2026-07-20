from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import math

from server import schemas, crud
from server.database import get_db

router = APIRouter()


def validate_isbn_format(isbn: str):
    cleaned = isbn.replace("-", "").replace(" ", "")
    if len(cleaned) != 13 or not cleaned.isdigit():
        raise HTTPException(status_code=400, detail="Invalid ISBN format provided")
    return cleaned


@router.get("/books/search", response_model=schemas.BookSearchResponse)
def search_books(
    query: Optional[str] = Query(None, description="Search term"),
    search_by: str = Query(
        "all", description="Field to search by: 'all', 'title', 'author', 'isbn'"
    ),
    title: Optional[str] = Query(None, description="Specific title search"),
    author: Optional[str] = Query(None, description="Specific author search"),
    isbn: Optional[str] = Query(None, description="Specific ISBN search"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    limit: int = Query(10, ge=1, description="Number of results per page"),
    db: Session = Depends(get_db),
):
    # Validate ISBN if explicitly provided
    if isbn:
        validate_isbn_format(isbn)

    if query and search_by == "isbn":
        validate_isbn_format(query)

    items, total = crud.search_books(
        db=db,
        query=query,
        search_by=search_by,
        title=title,
        author=author,
        isbn=isbn,
        page=page,
        limit=limit,
    )

    pages = math.ceil(total / limit) if total > 0 else 1

    return schemas.BookSearchResponse(
        items=items, total=total, page=page, limit=limit, pages=pages
    )


@router.post("/books", response_model=schemas.BookResponse)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    # Validate ISBN format (already validated by Pydantic, but let's be safe)
    cleaned_isbn = book.isbn.replace("-", "").replace(" ", "")
    if len(cleaned_isbn) != 13 or not cleaned_isbn.isdigit():
        raise HTTPException(status_code=400, detail="Invalid ISBN format provided")

    # Check if book with this ISBN already exists
    existing_book = crud.get_book_by_isbn(db, cleaned_isbn)
    if existing_book:
        raise HTTPException(
            status_code=400, detail="Book with this ISBN already exists"
        )

    return crud.create_book(db=db, book=book)
