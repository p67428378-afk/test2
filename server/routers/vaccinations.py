from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import VaccinationCreate, VaccinationOut
from server.crud import (
    create_vaccination,
    get_vaccinations_by_pet,
    get_vaccination,
    get_pet,
)
from server.routers.auth import get_current_user

router = APIRouter(tags=["vaccinations"])


@router.post(
    "/api/v1/vaccinations",
    response_model=VaccinationOut,
    status_code=status.HTTP_201_CREATED,
)
def record_vaccination(
    vax_in: VaccinationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    pet = get_pet(db=db, pet_id=vax_in.pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{vax_in.pet_id}' not found",
        )
    vet_id = vax_in.vet_id
    if not vet_id and current_user and current_user.role == "vet":
        vet_id = current_user.id
    return create_vaccination(db=db, vax_in=vax_in, vet_id=vet_id)


@router.get("/api/v1/pets/{pet_id}/vaccinations", response_model=List[VaccinationOut])
def retrieve_pet_vaccinations(pet_id: str, db: Session = Depends(get_db)):
    pet = get_pet(db=db, pet_id=pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{pet_id}' not found",
        )
    return get_vaccinations_by_pet(db=db, pet_id=pet_id)


@router.get("/api/v1/vaccinations/{id}", response_model=VaccinationOut)
def retrieve_vaccination(id: str, db: Session = Depends(get_db)):
    vax = get_vaccination(db=db, vax_id=id)
    if not vax:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vaccination with id '{id}' not found",
        )
    return vax
