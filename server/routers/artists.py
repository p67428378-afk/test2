from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import schemas, crud

router = APIRouter(prefix="/api/v1/artists", tags=["Artists"])


@router.get("", response_model=List[schemas.ArtistResponse])
def list_artists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_artists(db, skip=skip, limit=limit)


@router.post(
    "", response_model=schemas.ArtistResponse, status_code=status.HTTP_201_CREATED
)
def create_artist(artist_data: schemas.ArtistCreate, db: Session = Depends(get_db)):
    return crud.create_artist(db, artist_data)


@router.get("/{artist_id}", response_model=schemas.ArtistResponse)
def get_artist(artist_id: str, db: Session = Depends(get_db)):
    artist = crud.get_artist(db, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist
