from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import schemas, services
from backend.database import get_db

router = APIRouter()

@router.post("/applicants/", response_model=schemas.ApplicantResponse, status_code=status.HTTP_201_CREATED)
def create_applicant(applicant: schemas.ApplicantCreate, db: Session = Depends(get_db)):
    return services.create_applicant(db=db, applicant=applicant)

@router.get("/applicants/{applicant_id}", response_model=schemas.ApplicantResponse)
def read_applicant(applicant_id: str, db: Session = Depends(get_db)):
    db_applicant = services.get_applicant(db, applicant_id=applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Applicant not found")
    return db_applicant

@router.get("/applicants/", response_model=List[schemas.ApplicantResponse])
def read_applicants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applicants = services.get_applicants(db, skip=skip, limit=limit)
    return applicants

@router.put("/applicants/{applicant_id}", response_model=schemas.ApplicantResponse)
def update_applicant(applicant_id: str, applicant: schemas.ApplicantUpdate, db: Session = Depends(get_db)):
    db_applicant = services.update_applicant(db, applicant_id, applicant)
    if db_applicant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Applicant not found")
    return db_applicant
