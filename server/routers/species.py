import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import Species, User
from server.schemas import SpeciesCreate, SpeciesUpdate, SpeciesOut
from server.middleware.auth import get_optional_current_user, get_current_user

router = APIRouter(prefix="/api/v1/species", tags=["Botanical Species Catalog"])


@router.get("", response_model=List[SpeciesOut])
def list_species(
    q: Optional[str] = Query(
        None, description="Search query across common and scientific names"
    ),
    query: Optional[str] = Query(None, description="Search query alias"),
    sunlight: Optional[str] = Query(None, description="Filter by sunlight requirement"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    search_term = q or query
    db_query = db.query(Species)

    if search_term:
        term = f"%{search_term.strip()}%"
        db_query = db_query.filter(
            or_(
                Species.common_name.ilike(term),
                Species.scientific_name.ilike(term),
                Species.description.ilike(term),
            )
        )

    if sunlight and sunlight.lower() != "all":
        s_clean = sunlight.strip()
        if s_clean.lower() == "direct":
            db_query = db_query.filter(
                Species.sunlight_requirement.ilike("%direct%"),
                ~Species.sunlight_requirement.ilike("%indirect%"),
            )
        else:
            db_query = db_query.filter(
                Species.sunlight_requirement.ilike(f"%{s_clean}%")
            )

    species_list = (
        db_query.order_by(Species.common_name.asc()).offset(skip).limit(limit).all()
    )
    return species_list


@router.get("/{species_id}", response_model=SpeciesOut)
def get_species(species_id: str, db: Session = Depends(get_db)):
    species = db.query(Species).filter(Species.id == species_id).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Species with id '{species_id}' not found",
        )
    return species


@router.post("", response_model=SpeciesOut, status_code=status.HTTP_201_CREATED)
def create_custom_species(
    species_in: SpeciesCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    if not species_in.common_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Common name is required",
        )

    species = Species(
        id=str(uuid.uuid4()),
        common_name=species_in.common_name.strip(),
        scientific_name=species_in.scientific_name.strip()
        if species_in.scientific_name
        else None,
        sunlight_requirement=species_in.sunlight_requirement or "Bright Indirect Light",
        light_requirement=species_in.light_requirement
        or species_in.sunlight_requirement
        or "Bright Indirect Light",
        humidity_requirement=species_in.humidity_requirement
        or "Medium to High (50-60%)",
        humidity_target_pct=species_in.humidity_target_pct or 50,
        temp_min_f=species_in.temp_min_f or 65,
        temp_max_f=species_in.temp_max_f or 80,
        recommended_watering_days=species_in.recommended_watering_days or 7,
        default_watering_interval_days=species_in.default_watering_interval_days
        or species_in.recommended_watering_days
        or 7,
        default_fertilization_interval_days=species_in.default_fertilization_interval_days
        or 30,
        description=species_in.description.strip() if species_in.description else None,
        is_custom=True,
        created_by_user_id=current_user.id if current_user else None,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(species)
    db.commit()
    db.refresh(species)
    return species


@router.put("/{species_id}", response_model=SpeciesOut)
def update_species(
    species_id: str,
    species_update: SpeciesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    species = db.query(Species).filter(Species.id == species_id).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Species with id '{species_id}' not found",
        )

    update_data = species_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(species, field, value)

    species.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(species)
    return species


@router.delete("/{species_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_species(
    species_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    species = db.query(Species).filter(Species.id == species_id).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Species with id '{species_id}' not found",
        )
    db.delete(species)
    db.commit()
    return None
