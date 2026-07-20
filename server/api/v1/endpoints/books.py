from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from server import schemas, crud
from server.database import get_db

router = APIRouter()


@router.get("/books/search", response_model=schemas.BookSearchResponse)
def search_books(
    query: Optional[str] = None,
    search_by: str = "all",
    title: Optional[str] = None,
    author: Optional[str] = None,
    isbn: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    try:
        items, total, pages = crud.search_books(
            db=db,
            query=query,
            search_by=search_by,
            title=title,
            author=author,
            isbn=isbn,
            page=page,
            limit=limit,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return schemas.BookSearchResponse(
        items=items, total=total, page=page, pages=pages, limit=limit
    )


@router.post("/books", response_model=schemas.BookResponse, status_code=201)
def create_book(book_in: schemas.BookCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_book(db=db, book_in=book_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
