from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Vaccination, Pet, User
from server.schemas import VaccinationCreate, VaccinationResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1", tags=["vaccinations"])


@router.post(
    "/vaccinations",
    response_model=VaccinationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vaccination(
    vax_in: VaccinationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify pet exists
    pet = db.query(Pet).filter(Pet.id == vax_in.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    vet_id = vax_in.vet_id if vax_in.vet_id else current_user.id
    administered_date = (
        vax_in.administered_date
        if vax_in.administered_date
        else datetime.now(timezone.utc)
    )

    vaccination = Vaccination(
        pet_id=vax_in.pet_id,
        vaccine_name=vax_in.vaccine_name,
        administered_date=administered_date,
        next_due_date=vax_in.next_due_date,
        vet_id=vet_id,
        status=vax_in.status or "UP_TO_DATE",
    )
    db.add(vaccination)
    db.commit()
    db.refresh(vaccination)
    return vaccination


@router.get("/pets/{pet_id}/vaccinations", response_model=List[VaccinationResponse])
def get_pet_vaccinations(
    pet_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Verify pet exists
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    vaccinations = (
        db.query(Vaccination)
        .filter(Vaccination.pet_id == pet_id)
        .order_by(Vaccination.administered_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return vaccinations
