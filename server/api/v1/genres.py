from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.genre import Genre
from server.schemas.genre import GenreResponse

router = APIRouter()

GENRE_ORDER = {
    "fantasy": 1,
    "scifi": 2,
    "cyberpunk": 3,
    "mystery": 4,
    "historical": 5,
    "general": 6,
}


@router.get("", response_model=List[GenreResponse])
def get_genres(db: Session = Depends(get_db)) -> List[GenreResponse]:
    """Retrieve all predefined character genres."""
    genres = db.query(Genre).all()
    # Sort genres according to canonical order
    sorted_genres = sorted(
        genres, key=lambda g: GENRE_ORDER.get(g.code, 99)
    )
    return [GenreResponse.model_validate(g) for g in sorted_genres]
