from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.medical_record import MedicalRecord
from server.models.patient import Patient
from server.models.doctor import Doctor
from server.schemas.medical_record import MedicalRecordCreate, MedicalRecordResponse

router = APIRouter()


def require_medical_staff(x_role: Optional[str] = Header(None)):
    if x_role not in ["Doctor", "Admin", "Nurse"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Medical staff role required.",
        )


@router.post(
    "/medical_records",
    response_model=MedicalRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medical_record(
    record_in: MedicalRecordCreate,
    db: Session = Depends(get_db),
    _=Depends(require_medical_staff),
):
    # Check if patient exists
    patient = db.query(Patient).filter(Patient.id == record_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )

    # Check if doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == record_in.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found."
        )

    db_record = MedicalRecord(
        patient_id=record_in.patient_id,
        doctor_id=record_in.doctor_id,
        visit_date=record_in.visit_date,
        symptoms=record_in.symptoms,
        diagnosis=record_in.diagnosis,
        treatment_plan=record_in.treatment_plan,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("/medical_records/{record_id}", response_model=MedicalRecordResponse)
def get_medical_record(
    record_id: str, db: Session = Depends(get_db), _=Depends(require_medical_staff)
):
    db_record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found."
        )
    return db_record
