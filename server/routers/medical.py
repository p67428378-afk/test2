from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import MedicalRecord, Prescription, Patient, User, Appointment
from server.schemas import (
    MedicalRecordCreate,
    MedicalRecordResponse,
    PrescriptionCreate,
    PrescriptionResponse,
)
from server.security import get_current_user, require_roles

router = APIRouter(prefix="/api/v1", tags=["Medical Records & Prescriptions"])


@router.post(
    "/medical-records",
    response_model=MedicalRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medical_record(
    record_in: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["Doctor", "Admin"])),
):
    """Log consultation notes and primary diagnosis. (Doctor / Admin only)"""
    # Verify patient
    patient = db.query(Patient).filter(Patient.id == record_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )

    # Verify appointment
    appointment = (
        db.query(Appointment).filter(Appointment.id == record_in.appointment_id).first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
        )

    record = MedicalRecord(
        patient_id=record_in.patient_id,
        doctor_id=record_in.doctor_id,
        appointment_id=record_in.appointment_id,
        diagnosis=record_in.diagnosis,
        notes=record_in.notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/medical-records", response_model=List[MedicalRecordResponse])
def list_medical_records(
    patient_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List medical records with optional patient filter."""
    query = db.query(MedicalRecord)
    if patient_id:
        query = query.filter(MedicalRecord.patient_id == patient_id)
    return query.offset(skip).limit(limit).all()


@router.get(
    "/medical-records/patient/{patient_id}", response_model=List[MedicalRecordResponse]
)
def get_patient_medical_records(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all medical records for a specific patient."""
    records = (
        db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()
    )
    return records


@router.post(
    "/prescriptions",
    response_model=PrescriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prescription(
    prescription_in: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["Doctor", "Admin"])),
):
    """Create digital prescription linked to a medical record. (Doctor / Admin only)"""
    record = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.id == prescription_in.medical_record_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found."
        )

    prescription = Prescription(
        medical_record_id=prescription_in.medical_record_id,
        medication_name=prescription_in.medication_name,
        dosage=prescription_in.dosage,
        instructions=prescription_in.instructions,
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    return prescription


@router.get("/prescriptions", response_model=List[PrescriptionResponse])
def list_prescriptions(
    medical_record_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List prescriptions with optional medical_record_id filter."""
    query = db.query(Prescription)
    if medical_record_id:
        query = query.filter(Prescription.medical_record_id == medical_record_id)
    return query.offset(skip).limit(limit).all()
