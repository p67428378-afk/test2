from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Pet, User
from server.schemas import PetCreate, PetUpdate, PetResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/pets", tags=["pets"])


@router.get("", response_model=List[PetResponse])
def list_pets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    owner_id: Optional[str] = None,
    species: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Pet)
    if owner_id:
        query = query.filter(Pet.owner_id == owner_id)
    if species:
        query = query.filter(Pet.species.ilike(f"%{species}%"))
    pets = query.offset(skip).limit(limit).all()
    return pets


@router.post("", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
def create_pet(
    pet_in: PetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    owner_id = pet_in.owner_id if pet_in.owner_id else current_user.id

    # Ensure owner exists
    owner = db.query(User).filter(User.id == owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner user not found")

    pet = Pet(
        owner_id=owner_id,
        name=pet_in.name,
        species=pet_in.species,
        breed=pet_in.breed,
        age=pet_in.age,
        weight=pet_in.weight,
        gender=pet_in.gender,
        microchip_number=pet_in.microchip_number,
    )
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet


@router.get("/{id}", response_model=PetResponse)
def get_pet(id: str, db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet


@router.put("/{id}", response_model=PetResponse)
def update_pet(
    id: str,
    pet_in: PetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pet = db.query(Pet).filter(Pet.id == id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    update_data = pet_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pet, field, value)

    db.commit()
    db.refresh(pet)
    return pet
