from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user, get_current_librarian
from typing import List, Optional, Union
from uuid import UUID

router = APIRouter()


@router.get(
    "/books",
    response_model=Union[schemas.BookSearchResponse, List[schemas.BookResponse]],
)
def read_books(
    search: Optional[str] = Query(None, description="Search by title, author, or ISBN"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    paginated: Optional[bool] = Query(
        None, description="Whether to return paginated response"
    ),
):
    books = crud.get_books(db, search=search, genre=genre, skip=skip, limit=limit)
    if paginated:
        # Calculate total
        query = db.query(models.Book)
        if search:
            from sqlalchemy import or_

            query = query.filter(
                or_(
                    models.Book.title.ilike(f"%{search}%"),
                    models.Book.author.ilike(f"%{search}%"),
                    models.Book.isbn.ilike(f"%{search}%"),
                )
            )
        if genre:
            query = query.filter(models.Book.genre.ilike(f"%{genre}%"))
        total = query.count()

        return {"items": books, "limit": limit, "skip": skip, "total": total}
    return books


@router.post(
    "/books", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED
)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_book = crud.get_book_by_isbn(db, isbn=book.isbn)
    if db_book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book with this ISBN already exists",
        )
    return crud.create_book(db, book=book)


@router.get("/books/{book_id}", response_model=schemas.BookResponse)
def read_book(
    book_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_book = crud.get_book_by_id(db, book_id=book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return db_book


@router.put("/books/{book_id}", response_model=schemas.BookResponse)
def update_book(
    book_id: UUID,
    book_update: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_book = crud.get_book_by_id(db, book_id=book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return crud.update_book(db, db_book=db_book, book_update=book_update)


@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_book = crud.get_book_by_id(db, book_id=book_id)
    if not db_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    crud.delete_book(db, db_book=db_book)
    return None
