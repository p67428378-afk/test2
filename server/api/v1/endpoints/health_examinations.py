from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db
from typing import List, Optional
from uuid import UUID

router = APIRouter()

@router.post("/health-examinations", response_model=schemas.HealthExaminationResponse)
def create_health_examination(exam: schemas.HealthExaminationCreate, db: Session = Depends(get_db)):
    animal = crud.get_animal(db, exam.animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return crud.create_health_examination(db, exam)

@router.get("/health-examinations", response_model=List[schemas.HealthExaminationResponse])
def list_health_examinations(
    animal_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    if animal_id:
        animal = crud.get_animal(db, animal_id)
        if not animal:
            raise HTTPException(status_code=404, detail="Animal not found")
    return crud.get_health_examinations(db, animal_id=animal_id, skip=skip, limit=limit)
