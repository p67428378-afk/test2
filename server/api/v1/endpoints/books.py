from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from server import crud, schemas
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_librarian

router = APIRouter()


@router.get("/books", response_model=List[schemas.BookResponse])
def read_books(
    skip: int = Query(0, gte=0),
    limit: int = Query(100, gte=1, lte=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # If skip or limit are invalid, Query validation will raise 422, but let's also handle 400 if needed
    if skip < 0 or limit < 1:
        raise HTTPException(status_code=400, detail="Invalid query parameters")
    return crud.get_books(db, skip=skip, limit=limit, search=search)


@router.post(
    "/books", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED
)
def create_new_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    if book.copies_total < 1:
        raise HTTPException(status_code=400, detail="copies_total must be at least 1")

    db_book = crud.get_book_by_isbn(db, isbn=book.isbn)
    if db_book:
        raise HTTPException(status_code=400, detail="ISBN already exists")

    return crud.create_book(db, book=book)


@router.get("/books/{id}", response_model=schemas.BookResponse)
def read_book(id: str, db: Session = Depends(get_db)):
    db_book = crud.get_book(db, book_id=id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@router.put("/books/{id}", response_model=schemas.BookResponse)
def update_existing_book(
    id: str,
    book: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    if book.copies_total < 1:
        raise HTTPException(status_code=400, detail="copies_total must be at least 1")

    db_book = crud.get_book(db, book_id=id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Check if ISBN is being changed to an existing one
    isbn_book = crud.get_book_by_isbn(db, isbn=book.isbn)
    if isbn_book and str(isbn_book.id) != id:
        raise HTTPException(status_code=400, detail="ISBN already exists")

    updated_book = crud.update_book(db, book_id=id, book_data=book)
    return updated_book


@router.delete("/books/{id}")
def delete_existing_book(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    db_book = crud.get_book(db, book_id=id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    crud.delete_book(db, book_id=id)
    return {"detail": "Book deleted successfully"}
