from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from server.database import get_db
from server import models, schemas

router = APIRouter()


@router.get("/books", response_model=List[schemas.BookResponse])
def list_books(
    format: Optional[str] = None,
    price_range: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(models.Book)
    if format and format != "Format: All":
        query = query.filter(models.Book.format == format)

    if price_range and price_range != "Price: All":
        if price_range == "under_20" or price_range == "Under $20":
            query = query.filter(models.Book.price < 20.0)
        elif price_range == "20_50" or price_range == "$20 - $50":
            query = query.filter(models.Book.price >= 20.0, models.Book.price <= 50.0)
        elif price_range == "over_50" or price_range == "Over $50":
            query = query.filter(models.Book.price > 50.0)
        else:
            raise HTTPException(status_code=400, detail="Invalid price_range parameter")

    return query.offset(skip).limit(limit).all()


@router.get("/books/{id}", response_model=schemas.BookResponse)
def get_book(id: UUID, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == id).first()
    if not book:
        raise HTTPException(
            status_code=404, detail="Book with the specified ID does not exist"
        )
    return book


@router.post("/books", response_model=schemas.BookCreateResponse, status_code=201)
def create_book(book_in: schemas.BookCreate, db: Session = Depends(get_db)):
    # Check duplicate ISBN
    existing = db.query(models.Book).filter(models.Book.isbn == book_in.isbn).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="Book with this ISBN already exists"
        )

    book = models.Book(**book_in.dict())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/books/{id}", response_model=schemas.BookResponse)
def update_book(id: UUID, book_in: schemas.BookUpdate, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    update_data = book_in.dict(exclude_unset=True)
    if "isbn" in update_data:
        existing = (
            db.query(models.Book)
            .filter(models.Book.isbn == update_data["isbn"], models.Book.id != id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=400, detail="Book with this ISBN already exists"
            )

    for field, value in update_data.items():
        setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book


@router.delete("/books/{id}", status_code=204)
def delete_book(id: UUID, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return None
