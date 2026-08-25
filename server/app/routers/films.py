from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from server.app.database import get_db
from server.app.models.film import Film
from server.app.schemas.film import FilmResponse

router = APIRouter(prefix="/films", tags=["films"])


@router.get("", response_model=List[FilmResponse])
def search_films(
    search: str = Query(..., description="The search query (minimum 2 characters)"),
    db: Session = Depends(get_db),
):
    if len(search) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query must be at least 2 characters long",
        )

    films = db.query(Film).filter(Film.title.ilike(f"%{search}%")).all()
    return films
