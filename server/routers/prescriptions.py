from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.prescription import Prescription
from server.models.medical_record import MedicalRecord
from server.models.medication import Medication
from server.schemas.prescription import PrescriptionCreate, PrescriptionResponse

router = APIRouter()


def require_medical_staff(x_role: Optional[str] = Header(None)):
    if x_role not in ["Doctor", "Admin", "Nurse"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Medical staff role required.",
        )


@router.post(
    "/prescriptions",
    response_model=PrescriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prescription(
    prescription_in: PrescriptionCreate,
    db: Session = Depends(get_db),
    _=Depends(require_medical_staff),
):
    # Check if medical record exists
    record = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.id == prescription_in.medical_record_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Medical record not found."
        )

    # Check if medication exists
    medication = (
        db.query(Medication)
        .filter(Medication.id == prescription_in.medication_id)
        .first()
    )
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Medication not found."
        )

    db_prescription = Prescription(
        medical_record_id=prescription_in.medical_record_id,
        medication_id=prescription_in.medication_id,
        dosage=prescription_in.dosage,
        frequency=prescription_in.frequency,
        duration=prescription_in.duration,
        status="pending",
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription


@router.post(
    "/prescriptions/{prescription_id}/dispense", response_model=PrescriptionResponse
)
def dispense_prescription(
    prescription_id: str,
    db: Session = Depends(get_db),
    _=Depends(require_medical_staff),
):
    prescription = (
        db.query(Prescription).filter(Prescription.id == prescription_id).first()
    )
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found."
        )

    if prescription.status == "dispensed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prescription already dispensed.",
        )

    medication = prescription.medication
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Medication not found."
        )

    if medication.stock_quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Medication out of stock."
        )

    # Reduce stock quantity
    medication.stock_quantity -= 1
    prescription.status = "dispensed"

    db.commit()
    db.refresh(prescription)
    return prescription
