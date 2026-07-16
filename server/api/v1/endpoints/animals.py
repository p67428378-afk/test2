from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db
from typing import List, Optional
from uuid import UUID
from datetime import datetime

router = APIRouter()

@router.get("/animals/locations", response_model=List[schemas.AnimalLocationResponse])
def get_latest_locations(db: Session = Depends(get_db)):
    animals = crud.get_animals(db)
    results = []
    for animal in animals:
        # Get the latest location for this animal
        locations = crud.get_animal_locations(db, animal.id)
        if locations:
            latest = locations[-1] # Ordered by timestamp asc, so last is latest
            results.append(schemas.AnimalLocationResponse(
                id=animal.id,
                name=animal.name,
                species=animal.species,
                gps_tag_id=animal.gps_tag_id,
                latitude=latest.latitude,
                longitude=latest.longitude,
                timestamp=latest.timestamp
            ))
    return results

@router.post("/animals", response_model=schemas.AnimalResponse)
def create_animal(animal: schemas.AnimalCreate, db: Session = Depends(get_db)):
    return crud.create_animal(db, animal)

@router.get("/animals", response_model=List[schemas.AnimalResponse])
def list_animals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_animals(db, skip=skip, limit=limit)

@router.post("/animals/locations", response_model=schemas.GPSLocationResponse)
def record_location(location: schemas.GPSLocationCreate, db: Session = Depends(get_db)):
    animal = crud.get_animal(db, location.animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return crud.create_gps_location(db, location)

@router.get("/animals/{animal_id}/migration", response_model=List[schemas.GPSLocationResponse])
def get_migration_path(
    animal_id: UUID,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    animal = crud.get_animal(db, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    
    start_dt = None
    end_dt = None
    if start_date:
        try:
            start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start_date format. Use ISO 8601.")
    if end_date:
        try:
            end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end_date format. Use ISO 8601.")
            
    return crud.get_animal_locations(db, animal_id, start_dt, end_dt)
