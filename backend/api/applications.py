from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from backend import crud, models, schemas
from backend.database import get_db
import shutil

router = APIRouter()

@router.post("/applicants/", response_model=schemas.Applicant)
def create_applicant(applicant: schemas.ApplicantCreate, db: Session = Depends(get_db)):
    db_applicant = crud.get_applicant_by_email(db, email=applicant.email_address)
    if db_applicant:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_applicant(db=db, applicant=applicant)

@router.post("/applicants/{applicant_id}/applications/", response_model=schemas.Application)
def create_application_for_applicant(
    applicant_id: str, application: schemas.ApplicationCreate, db: Session = Depends(get_db)
):
    return crud.create_application_for_applicant(db=db, application=application, applicant_id=applicant_id)

@router.get("/applications/", response_model=List[schemas.Application])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = crud.get_applications(db, skip=skip, limit=limit)
    return applications

@router.post("/applications/{application_id}/documents/")
def upload_document(application_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # In a real application, you would save the file to a secure location
    # and store the path in the database.
    # For this example, we'll just save it locally.
    file_location = f"documents/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Create a document record in the database
    # doc = schemas.DocumentCreate(document_type=file.content_type, file_name=file.filename)
    # crud.create_document_for_application(db, doc, application_id, file_location)

    return {"info": f"file '{file.filename}' saved at '{file_location}'"}
