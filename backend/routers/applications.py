from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import schemas, services
from backend.database import get_db

router = APIRouter()

@router.post("/applications/", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    return services.create_application(db=db, application=application)

@router.get("/applications/{application_id}", response_model=schemas.ApplicationResponse)
def read_application(application_id: str, db: Session = Depends(get_db)):
    db_application = services.get_application(db, application_id=application_id)
    if db_application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return db_application

@router.get("/applications/", response_model=List[schemas.ApplicationResponse])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = services.get_applications(db, skip=skip, limit=limit)
    return applications

@router.put("/applications/{application_id}", response_model=schemas.ApplicationResponse)
def update_application(application_id: str, application: schemas.ApplicationUpdate, db: Session = Depends(get_db)):
    db_application = services.update_application(db, application_id, application)
    if db_application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return db_application
