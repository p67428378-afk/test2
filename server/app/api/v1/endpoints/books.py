from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from server.database import get_db
from server.app.schemas.book import Book, BookCreate
from server.app.crud import book as crud_book

router = APIRouter()


@router.post("/books", response_model=Book, status_code=201)
def create_book(book_in: BookCreate, db: Session = Depends(get_db)):
    db_book = crud_book.get_book_by_isbn(db, isbn=book_in.isbn)
    if db_book:
        raise HTTPException(
            status_code=400, detail="ISBN already exists in the catalog"
        )
    return crud_book.create_book(db=db, book_in=book_in)


@router.get("/books", response_model=List[Book])
def list_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud_book.get_books(db=db, skip=skip, limit=limit, search=search)
