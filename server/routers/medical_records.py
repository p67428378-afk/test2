from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import MedicalRecordCreate, MedicalRecordOut
from server.crud import (
    create_medical_record,
    get_medical_records_by_pet,
    get_medical_record,
    get_pet,
)
from server.routers.auth import get_current_user

router = APIRouter(tags=["medical_records"])


@router.post(
    "/api/v1/medical-records",
    response_model=MedicalRecordOut,
    status_code=status.HTTP_201_CREATED,
)
def log_medical_record(
    rec_in: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    pet = get_pet(db=db, pet_id=rec_in.pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{rec_in.pet_id}' not found",
        )
    vet_id = rec_in.vet_id
    if not vet_id and current_user and current_user.role == "vet":
        vet_id = current_user.id
    return create_medical_record(db=db, rec_in=rec_in, vet_id=vet_id)


@router.get(
    "/api/v1/pets/{pet_id}/medical-records", response_model=List[MedicalRecordOut]
)
def retrieve_pet_medical_records(pet_id: str, db: Session = Depends(get_db)):
    pet = get_pet(db=db, pet_id=pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{pet_id}' not found",
        )
    return get_medical_records_by_pet(db=db, pet_id=pet_id)


@router.get("/api/v1/medical-records/{id}", response_model=MedicalRecordOut)
def retrieve_medical_record(id: str, db: Session = Depends(get_db)):
    rec = get_medical_record(db=db, record_id=id)
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medical record with id '{id}' not found",
        )
    return rec
