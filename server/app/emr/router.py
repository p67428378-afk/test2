from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import EMRRecord, Appointment, Patient, User
from server.schemas import EMRRecordCreate, EMRRecordResponse
from server.app.auth.utils import get_current_user, require_roles

router = APIRouter(prefix="/emr", tags=["Electronic Medical Records"])


@router.post(
    "/records", response_model=EMRRecordResponse, status_code=status.HTTP_201_CREATED
)
def create_emr_record(
    record_in: EMRRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Doctor")),
):
    # Verify appointment exists
    appointment = (
        db.query(Appointment).filter(Appointment.id == record_in.appointment_id).first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == record_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    # Verify doctor exists
    doctor = db.query(User).filter(User.id == record_in.doctor_id).first()
    if not doctor or doctor.role != "Doctor":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    emr = EMRRecord(
        appointment_id=record_in.appointment_id,
        patient_id=record_in.patient_id,
        doctor_id=record_in.doctor_id,
        diagnosis=record_in.diagnosis,
        clinical_notes=record_in.clinical_notes,
        prescriptions=record_in.prescriptions,
        lab_orders=record_in.lab_orders,
    )
    db.add(emr)
    db.commit()
    db.refresh(emr)
    return emr


@router.get("/patients/{patient_id}", response_model=List[EMRRecordResponse])
def get_patient_emr_history(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    if current_user.role not in ["Admin", "Doctor", "Staff"]:
        if patient.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access these medical records",
            )

    records = (
        db.query(EMRRecord)
        .filter(EMRRecord.patient_id == patient_id)
        .order_by(EMRRecord.created_at.desc())
        .all()
    )
    return records


@router.get("/records/{record_id}", response_model=EMRRecordResponse)
def get_emr_record(
    record_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(EMRRecord).filter(EMRRecord.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="EMR record not found",
        )

    if current_user.role not in ["Admin", "Doctor", "Staff"]:
        patient = db.query(Patient).filter(Patient.id == record.patient_id).first()
        if not patient or patient.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this medical record",
            )

    return record
