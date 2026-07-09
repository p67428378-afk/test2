from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from server.database import get_db
from server.models import Pet
from server.schemas import (
    PetCreate,
    PetUpdate,
    PetResponse,
    PetListResponse,
    DeleteResponse,
)
from server.auth import get_current_admin

router = APIRouter()


@router.get("", response_model=PetListResponse)
def list_pets(
    breed: Optional[str] = Query(None),
    age: Optional[float] = Query(None),
    location: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(Pet)
    if breed:
        query = query.filter(Pet.breed.ilike(f"%{breed}%"))
    if age is not None:
        query = query.filter(Pet.age == age)
    if location:
        query = query.filter(Pet.location.ilike(f"%{location}%"))

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/{pet_id}", response_model=PetResponse)
def get_pet(pet_id: uuid.UUID, db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found"
        )
    return pet


@router.post(
    "/admin/pets", response_model=PetResponse, status_code=status.HTTP_201_CREATED
)
def create_pet(
    pet_in: PetCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)
):
    new_pet = Pet(**pet_in.dict())
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet


@router.put("/admin/pets/{pet_id}", response_model=PetResponse)
def update_pet(
    pet_id: uuid.UUID,
    pet_in: PetUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found"
        )
    for key, value in pet_in.dict().items():
        setattr(pet, key, value)
    db.commit()
    db.refresh(pet)
    return pet


@router.delete("/admin/pets/{pet_id}", response_model=DeleteResponse)
def delete_pet(
    pet_id: uuid.UUID, db: Session = Depends(get_db), admin=Depends(get_current_admin)
):
    pet = db.query(Pet).filter(Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found"
        )
    db.delete(pet)
    db.commit()
    return {"success": True}


# Duplicate endpoints to match exact WorkSpec paths
@router.post(
    "/admin/pets",
    response_model=PetResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_pet_alt(
    pet_in: PetCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)
):
    return create_pet(pet_in, db, admin)


@router.put("/admin/pets/{pet_id}", response_model=PetResponse, include_in_schema=False)
def update_pet_alt(
    pet_id: uuid.UUID,
    pet_in: PetUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    return update_pet(pet_id, pet_in, db, admin)


@router.delete(
    "/admin/pets/{pet_id}", response_model=DeleteResponse, include_in_schema=False
)
def delete_pet_alt(
    pet_id: uuid.UUID, db: Session = Depends(get_db), admin=Depends(get_current_admin)
):
    return delete_pet(pet_id, db, admin)
