from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from server import crud, schemas, database

router = APIRouter()


@router.get("/greetings", response_model=List[schemas.Greeting])
def read_greetings(
    skip: int = Query(0, ge=0, description="Number of greetings to skip"),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of greetings to return"
    ),
    db: Session = Depends(database.get_db),
):
    """
    Retrieves a list of all greetings.
    """
    # Ensure database is seeded
    crud.seed_greetings(db)
    return crud.get_greetings(db, skip=skip, limit=limit)
