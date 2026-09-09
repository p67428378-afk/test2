import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import User, UserPlant, Species, WateringLog
from server.schemas import (
    UserPlantCreate,
    UserPlantUpdate,
    UserPlantResponse,
    UserPlantDetailResponse,
    WaterPlantRequest,
)
from server.middleware.auth import get_current_user

router = APIRouter()


def utc_now():
    return datetime.now(timezone.utc)


@router.get("", response_model=List[UserPlantResponse])
@router.get("/", response_model=List[UserPlantResponse], include_in_schema=False)
def list_user_plants(
    location: Optional[str] = Query(None, description="Filter by room/location"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(UserPlant)
        .options(joinedload(UserPlant.species))
        .filter(UserPlant.user_id == current_user.id)
    )
    if location:
        query = query.filter(UserPlant.location.ilike(f"%{location}%"))
    return query.order_by(UserPlant.created_at.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=UserPlantResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=UserPlantResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_user_plant(
    plant_in: UserPlantCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    species = None
    if plant_in.species_id:
        species = db.query(Species).filter(Species.id == plant_in.species_id).first()
        if not species:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Species with id '{plant_in.species_id}' not found",
            )

    interval = plant_in.watering_interval_days
    if interval is None:
        if species and species.recommended_watering_days:
            interval = species.recommended_watering_days
        else:
            interval = 7

    now = utc_now()
    last_watered = plant_in.last_watered
    if last_watered:
        next_due = last_watered + timedelta(days=interval)
    else:
        next_due = now + timedelta(days=interval)

    new_plant = UserPlant(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        species_id=plant_in.species_id,
        nickname=plant_in.nickname,
        location=plant_in.location,
        photo_url=plant_in.photo_url,
        watering_interval_days=interval,
        last_watered=last_watered,
        next_due_date=next_due,
        notifications_enabled=plant_in.notifications_enabled,
    )
    db.add(new_plant)
    db.commit()
    db.refresh(new_plant)

    # If last_watered was provided, also create initial watering log
    if last_watered:
        log = WateringLog(
            id=str(uuid.uuid4()),
            plant_id=new_plant.id,
            watered_at=last_watered,
            notes="Initial watering recorded on plant creation",
        )
        db.add(log)
        db.commit()

    # Re-query with species joined
    refreshed = (
        db.query(UserPlant)
        .options(joinedload(UserPlant.species))
        .filter(UserPlant.id == new_plant.id)
        .first()
    )
    return refreshed


@router.get("/{plant_id}", response_model=UserPlantDetailResponse)
def get_user_plant(
    plant_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant = (
        db.query(UserPlant)
        .options(
            joinedload(UserPlant.species),
            joinedload(UserPlant.watering_logs),
        )
        .filter(UserPlant.id == plant_id, UserPlant.user_id == current_user.id)
        .first()
    )
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant with id '{plant_id}' not found",
        )
    return plant


@router.put("/{plant_id}", response_model=UserPlantResponse)
def update_user_plant(
    plant_id: str,
    plant_in: UserPlantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant = (
        db.query(UserPlant)
        .filter(UserPlant.id == plant_id, UserPlant.user_id == current_user.id)
        .first()
    )
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant with id '{plant_id}' not found",
        )

    if plant_in.species_id is not None:
        if plant_in.species_id:
            species = (
                db.query(Species).filter(Species.id == plant_in.species_id).first()
            )
            if not species:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Species with id '{plant_in.species_id}' not found",
                )
        plant.species_id = plant_in.species_id or None

    if plant_in.nickname is not None:
        plant.nickname = plant_in.nickname
    if plant_in.location is not None:
        plant.location = plant_in.location
    if plant_in.photo_url is not None:
        plant.photo_url = plant_in.photo_url
    if plant_in.notifications_enabled is not None:
        plant.notifications_enabled = plant_in.notifications_enabled

    if plant_in.watering_interval_days is not None:
        plant.watering_interval_days = plant_in.watering_interval_days
        # Recalculate next_due_date based on last_watered or created_at
        base_time = plant.last_watered or plant.created_at
        if base_time:
            plant.next_due_date = base_time + timedelta(
                days=plant.watering_interval_days
            )

    db.commit()

    refreshed = (
        db.query(UserPlant)
        .options(joinedload(UserPlant.species))
        .filter(UserPlant.id == plant.id)
        .first()
    )
    return refreshed


@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_plant(
    plant_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant = (
        db.query(UserPlant)
        .filter(UserPlant.id == plant_id, UserPlant.user_id == current_user.id)
        .first()
    )
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant with id '{plant_id}' not found",
        )
    db.delete(plant)
    db.commit()
    return None


@router.post("/{plant_id}/water", response_model=UserPlantDetailResponse)
def water_user_plant(
    plant_id: str,
    water_req: Optional[WaterPlantRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant = (
        db.query(UserPlant)
        .filter(UserPlant.id == plant_id, UserPlant.user_id == current_user.id)
        .first()
    )
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant with id '{plant_id}' not found",
        )

    watered_at = (
        water_req.watered_at if water_req and water_req.watered_at else None
    ) or utc_now()
    notes = water_req.notes if water_req else None

    plant.last_watered = watered_at
    plant.next_due_date = watered_at + timedelta(days=plant.watering_interval_days)

    log = WateringLog(
        id=str(uuid.uuid4()),
        plant_id=plant.id,
        watered_at=watered_at,
        notes=notes,
    )
    db.add(log)
    db.commit()

    refreshed = (
        db.query(UserPlant)
        .options(
            joinedload(UserPlant.species),
            joinedload(UserPlant.watering_logs),
        )
        .filter(UserPlant.id == plant.id)
        .first()
    )
    return refreshed
