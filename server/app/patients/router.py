from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import Patient, User
from server.schemas import PatientCreate, PatientUpdate, PatientResponse
from server.app.auth.utils import get_current_user, require_roles

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Staff", "Doctor")),
):
    patient = Patient(
        user_id=patient_in.user_id,
        full_name=patient_in.full_name,
        date_of_birth=patient_in.date_of_birth,
        gender=patient_in.gender,
        phone=patient_in.phone,
        emergency_contact=patient_in.emergency_contact,
        medical_history=patient_in.medical_history,
        insurance_provider=patient_in.insurance_provider,
        insurance_policy_number=patient_in.insurance_policy_number,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("", response_model=List[PatientResponse])
def list_patients(
    search: Optional[str] = Query(None, description="Search by name or phone"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Staff", "Doctor")),
):
    query = db.query(Patient)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Patient.full_name.ilike(search_filter),
                Patient.phone.ilike(search_filter),
            )
        )
    patients = query.offset(skip).limit(limit).all()
    return patients


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
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

    # Allow access if Staff/Admin/Doctor or if the current patient is viewing their own record
    if current_user.role not in ["Admin", "Staff", "Doctor"]:
        if patient.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this patient profile",
            )
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
@router.patch("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Staff", "Doctor")),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    update_data = patient_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient
