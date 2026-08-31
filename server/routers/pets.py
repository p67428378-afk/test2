from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import PetCreate, PetUpdate, PetOut
from server.crud import (
    get_pets,
    get_pet,
    create_pet,
    update_pet,
    delete_pet,
)
from server.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/pets", tags=["pets"])


@router.get("", response_model=List[PetOut])
def list_pets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    owner_id: Optional[str] = Query(None),
    species: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return get_pets(
        db=db,
        skip=skip,
        limit=limit,
        owner_id=owner_id,
        species=species,
        search=search,
    )


@router.post("", response_model=PetOut, status_code=status.HTTP_201_CREATED)
def register_pet(
    pet_in: PetCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    owner_id = pet_in.owner_id
    if not owner_id and current_user:
        owner_id = current_user.id
    return create_pet(db=db, pet_in=pet_in, owner_id=owner_id)


@router.get("/{id}", response_model=PetOut)
def retrieve_pet(id: str, db: Session = Depends(get_db)):
    pet = get_pet(db=db, pet_id=id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{id}' not found",
        )
    return pet


@router.put("/{id}", response_model=PetOut)
def modify_pet(id: str, pet_in: PetUpdate, db: Session = Depends(get_db)):
    pet = update_pet(db=db, pet_id=id, pet_in=pet_in)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{id}' not found",
        )
    return pet


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_pet(id: str, db: Session = Depends(get_db)):
    success = delete_pet(db=db, pet_id=id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{id}' not found",
        )
    return None
