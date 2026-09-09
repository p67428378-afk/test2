import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from server.database import get_db
from server.models import Species
from server.schemas import SpeciesCreate, SpeciesResponse

router = APIRouter()


@router.get("", response_model=List[SpeciesResponse])
@router.get("/", response_model=List[SpeciesResponse], include_in_schema=False)
def list_species(
    q: Optional[str] = Query(None, description="Search by common or scientific name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Species)
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Species.common_name.ilike(search_pattern),
                Species.scientific_name.ilike(search_pattern),
            )
        )
    return query.offset(skip).limit(limit).all()


@router.get("/{species_id}", response_model=SpeciesResponse)
def get_species(species_id: str, db: Session = Depends(get_db)):
    species = db.query(Species).filter(Species.id == species_id).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Species with id '{species_id}' not found",
        )
    return species


@router.post("", response_model=SpeciesResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=SpeciesResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_species(species_in: SpeciesCreate, db: Session = Depends(get_db)):
    new_species = Species(
        id=str(uuid.uuid4()),
        common_name=species_in.common_name,
        scientific_name=species_in.scientific_name,
        sunlight_requirement=species_in.sunlight_requirement,
        humidity_requirement=species_in.humidity_requirement,
        recommended_watering_days=species_in.recommended_watering_days,
        description=species_in.description,
    )
    db.add(new_species)
    db.commit()
    db.refresh(new_species)
    return new_species
