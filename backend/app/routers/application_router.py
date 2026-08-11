from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, database
from ..services import application_service

router = APIRouter()

@router.post("/applicants/", response_model=schemas.ApplicantResponse, status_code=status.HTTP_201_CREATED)
def create_applicant(applicant: schemas.ApplicantCreate, db: Session = Depends(database.get_db)):
    db_applicant = application_service.get_applicant_by_email(db, email=applicant.email)
    if db_applicant:
        raise HTTPException(status_code=400, detail="Applicant with this email already registered")
    return application_service.create_applicant(db=db, applicant=applicant)

@router.post("/applications/", response_model=schemas.CreditCardApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: schemas.CreditCardApplicationCreate, db: Session = Depends(database.get_db)):
    # In a real scenario, you'd verify user_id and product_id exist
    return application_service.create_application(db=db, application=application)

@router.get("/applications/{application_id}", response_model=schemas.CreditCardApplicationResponse)
def get_application_status(application_id: str, db: Session = Depends(database.get_db)):
    db_application = application_service.get_application(db, application_id=application_id)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application

@router.get("/applicants/{user_id}/applications/", response_model=List[schemas.CreditCardApplicationResponse])
def get_applications_for_user(user_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    applications = application_service.get_applications_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return applications

@router.put("/applications/{application_id}/status", response_model=schemas.CreditCardApplicationResponse)
def update_application_status(application_id: str, status_update: schemas.CreditCardApplicationUpdate, db: Session = Depends(database.get_db)):
    db_application = application_service.update_application_status(db, application_id, status_update)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application
