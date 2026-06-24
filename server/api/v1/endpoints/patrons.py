from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_librarian, get_password_hash

router = APIRouter()


@router.get("/patrons", response_model=List[schemas.PatronResponse])
def read_patrons(
    skip: int = Query(0, gte=0),
    limit: int = Query(100, gte=1, lte=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    return crud.get_patrons(db, skip=skip, limit=limit)


@router.post(
    "/patrons",
    response_model=schemas.PatronResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_patron(
    patron: schemas.PatronCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_librarian),
):
    db_patron_username = crud.get_patron_by_username(db, username=patron.username)
    if db_patron_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    db_patron_email = crud.get_patron_by_email(db, email=patron.email)
    if db_patron_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = get_password_hash(patron.password)
    return crud.create_patron(db, patron=patron, hashed_password=hashed_password)
