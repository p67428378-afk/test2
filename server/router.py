from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import uuid

from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/animals", response_model=List[schemas.AnimalResponse])
def read_animals(name: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get a list of all animals in the zoo, optionally filtered by name.
    """
    return crud.get_animals(db, name=name)


@router.get("/animals/{animal_id}", response_model=schemas.AnimalResponse)
def read_animal(animal_id: UUID, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific animal.
    """
    db_animal = crud.get_animal_by_id(db, animal_id=animal_id)
    if db_animal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Animal not found"
        )
    return db_animal


@router.get("/enclosures", response_model=List[schemas.EnclosureResponse])
def read_enclosures(db: Session = Depends(get_db)):
    """
    Get a list of all enclosures and their locations on the map.
    """
    return crud.get_enclosures(db)


@router.get("/map", response_model=schemas.MapDataResponse)
def read_map(db: Session = Depends(get_db)):
    """
    Get the map data, including paths, facilities, and enclosure locations.
    """
    enclosures = crud.get_enclosures(db)
    facilities = crud.get_facilities(db)

    # Static paths fallback/mock as paths are not in the DB schema
    static_paths = [
        {
            "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
            "points": [[10.0, 20.0], [20.0, 30.0], [30.0, 40.0]],
        },
        {
            "id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
            "points": [[40.0, 50.0], [50.0, 60.0], [60.0, 70.0]],
        },
    ]

    return {"enclosures": enclosures, "facilities": facilities, "paths": static_paths}
