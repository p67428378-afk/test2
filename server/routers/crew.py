from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server import models, schemas

router = APIRouter(prefix="/crew", tags=["crew"])


@router.post(
    "", response_model=schemas.CrewResponse, status_code=status.HTTP_201_CREATED
)
def create_crew_member(crew: schemas.CrewCreate, db: Session = Depends(get_db)):
    import uuid

    db_crew = models.Crew(
        id=uuid.uuid4(),
        first_name=crew.first_name,
        last_name=crew.last_name,
        certification=crew.certification,
    )
    db.add(db_crew)
    db.commit()
    db.refresh(db_crew)
    return db_crew


@router.get("", response_model=List[schemas.CrewResponse])
def read_crew_members(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return db.query(models.Crew).offset(skip).limit(limit).all()
