from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()

@router.get("/wildlife_sightings", response_model=List[schemas.WildlifeSightingDetailResponse])
def read_wildlife_sightings(db: Session = Depends(get_db)):
    sightings = crud.get_all_wildlife_sightings(db)
    result = []
    for s in sightings:
        result.append(
            schemas.WildlifeSightingDetailResponse(
                id=s.id,
                user_id=s.user_id,
                logged_by=s.user.login_id if s.user else "Unknown",
                species=s.species,
                count=s.count,
                location=s.location,
                notes=s.notes,
                created_at=s.created_at
            )
        )
    return result

@router.post("/wildlife_sightings", response_model=schemas.WildlifeSightingResponse, status_code=status.HTTP_201_CREATED)
def create_wildlife_sighting(sighting: schemas.WildlifeSightingCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.id == sighting.user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return crud.create_wildlife_sighting(db, sighting=sighting)
