from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import schemas, crud
from server.database import get_db

router = APIRouter()

@router.get("/contacts", response_model=List[schemas.ContactResponse])
def read_contacts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    contacts = crud.get_contacts(db, skip=skip, limit=limit)
    return contacts

@router.post("/contacts", response_model=schemas.ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    # Check if contact with phone number already exists
    db_contact_phone = crud.get_contact_by_phone(db, phone_number=contact.phone_number)
    if db_contact_phone:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Contact with this phone number already exists"
        )
    
    # Check if contact with email already exists
    db_contact_email = crud.get_contact_by_email(db, email=contact.email)
    if db_contact_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Contact with this email already exists"
        )
    
    try:
        return crud.create_contact(db, contact=contact)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
