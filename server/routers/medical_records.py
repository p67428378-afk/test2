from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import MedicalRecord, Pet, User
from server.schemas import MedicalRecordCreate, MedicalRecordResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1", tags=["medical-records"])


@router.post(
    "/medical-records",
    response_model=MedicalRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medical_record(
    rec_in: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify pet exists
    pet = db.query(Pet).filter(Pet.id == rec_in.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    vet_id = rec_in.vet_id if rec_in.vet_id else current_user.id
    visit_date = rec_in.visit_date if rec_in.visit_date else datetime.now(timezone.utc)

    record = MedicalRecord(
        pet_id=rec_in.pet_id,
        appointment_id=rec_in.appointment_id,
        vet_id=vet_id,
        visit_date=visit_date,
        diagnosis=rec_in.diagnosis,
        treatment=rec_in.treatment,
        prescriptions=rec_in.prescriptions,
        notes=rec_in.notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get(
    "/pets/{pet_id}/medical-records", response_model=List[MedicalRecordResponse]
)
def get_pet_medical_records(
    pet_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Verify pet exists
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.pet_id == pet_id)
        .order_by(MedicalRecord.visit_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return records
