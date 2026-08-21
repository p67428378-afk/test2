from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import Patient, User
from server.schemas import PatientCreate, PatientUpdate, PatientResponse
from server.security import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/patients", tags=["Patients"])


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["Receptionist", "Admin", "Nurse"])),
):
    """Create a new patient profile. Checks for duplicate SSN/Government ID."""
    existing_patient = (
        db.query(Patient).filter(Patient.ssn_gov_id == patient_in.ssn_gov_id).first()
    )
    if existing_patient:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Patient with SSN/Gov ID '{patient_in.ssn_gov_id}' already exists.",
        )

    patient = Patient(**patient_in.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("", response_model=List[PatientResponse])
def list_patients(
    search: Optional[str] = Query(
        None, description="Search by SSN, first name, or last name"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List patient profiles with pagination and search filtering."""
    query = db.query(Patient)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Patient.ssn_gov_id.ilike(search_pattern),
                Patient.first_name.ilike(search_pattern),
                Patient.last_name.ilike(search_pattern),
            )
        )
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=PatientResponse)
def get_patient(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch detailed patient record by ID."""
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found."
        )
    return patient


@router.put("/{id}", response_model=PatientResponse)
def update_patient(
    id: str,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["Receptionist", "Admin", "Nurse", "Doctor"])
    ),
):
    """Update patient details."""
    patient = db.query(Patient).filter(Patient.id == id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found."
        )

    update_data = patient_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)
    return patient
