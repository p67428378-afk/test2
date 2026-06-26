from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from server import schemas, crud, models
from server.database import get_db
from server.core.security import require_librarian

router = APIRouter()


def format_book_response(book: models.Book) -> schemas.BookResponse:
    total_copies = len(book.copies)
    available_copies = sum(1 for copy in book.copies if copy.status == "available")
    book_status = "available" if available_copies > 0 else "out_of_stock"

    return schemas.BookResponse(
        id=str(book.id),
        title=str(book.title),
        author=str(book.author),
        isbn=str(book.isbn),
        published_date=book.published_date.isoformat() if book.published_date else None,
        total_copies=total_copies,
        available_copies=available_copies,
        status=book_status,
    )


@router.get("/books", response_model=List[schemas.BookResponse])
def list_books(
    search: Optional[str] = Query(None, description="Search by title, author, or ISBN"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    books = crud.get_books(db, search=search, skip=skip, limit=limit)
    return [format_book_response(book) for book in books]


@router.get("/books/{book_id}", response_model=schemas.BookDetailResponse)
def get_book(book_id: str, db: Session = Depends(get_db)):
    book = crud.get_book_by_id(db, book_id=book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )

    total_copies = len(book.copies)
    available_copies = sum(1 for copy in book.copies if copy.status == "available")
    book_status = "available" if available_copies > 0 else "out_of_stock"

    copies_list = [
        schemas.BookCopyResponse(id=str(copy.id), status=str(copy.status))
        for copy in book.copies
    ]

    return schemas.BookDetailResponse(
        id=str(book.id),
        title=str(book.title),
        author=str(book.author),
        isbn=str(book.isbn),
        published_date=book.published_date.isoformat() if book.published_date else None,
        total_copies=total_copies,
        available_copies=available_copies,
        status=book_status,
        copies=copies_list,
    )


@router.post(
    "/books", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED
)
def add_book(
    book_in: schemas.BookCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_librarian),
):
    # Check if ISBN already exists
    existing_book = crud.get_book_by_isbn(db, isbn=book_in.isbn)
    if existing_book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book with this ISBN already exists",
        )

    book = crud.create_book(db, book_in=book_in)
    return format_book_response(book)
