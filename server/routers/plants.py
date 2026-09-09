import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import UserPlant, Species, User, CareLog
from server.schemas import (
    UserPlantCreate,
    UserPlantUpdate,
    UserPlantOut,
    WaterPlantRequest,
    FertilizePlantRequest,
    SnoozePlantRequest,
    SpeciesOut,
)
from server.middleware.auth import get_current_user

router = APIRouter(prefix="/api/v1/plants", tags=["My Garden Plants"])


def _to_plant_out(plant: UserPlant) -> UserPlantOut:
    species_out = SpeciesOut.model_validate(plant.species) if plant.species else None
    species_name = str(plant.species.common_name) if plant.species else None

    return UserPlantOut(
        id=str(plant.id),
        user_id=str(plant.user_id),
        species_id=str(plant.species_id) if plant.species_id else None,
        nickname=str(plant.nickname),
        location=str(plant.location) if plant.location else "Living Room",
        photo_url=str(plant.photo_url) if plant.photo_url else None,
        status=str(plant.status) if plant.status else "Active",
        watering_interval_days=int(plant.watering_interval_days)
        if plant.watering_interval_days is not None
        else 7,
        fertilization_interval_days=int(plant.fertilization_interval_days)
        if plant.fertilization_interval_days is not None
        else 30,
        last_watered_at=plant.last_watered_at,
        next_water_due=plant.next_water_due,
        last_fertilized_at=plant.last_fertilized_at,
        next_fertilize_due=plant.next_fertilize_due,
        notifications_enabled=bool(plant.notifications_enabled),
        snoozed_until=plant.snoozed_until,
        created_at=plant.created_at,
        updated_at=plant.updated_at,
        last_watered=plant.last_watered_at,
        next_due_date=plant.next_water_due,
        species_name=species_name,
        species=species_out,
    )


@router.get("", response_model=List[UserPlantOut])
def list_user_plants(
    location: Optional[str] = Query(None, description="Filter plants by room location"),
    status_filter: Optional[str] = Query(
        None, alias="status", description="Filter plants by status"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(UserPlant).filter(UserPlant.user_id == current_user.id)

    if location and location.lower() != "all rooms":
        query = query.filter(UserPlant.location.ilike(f"%{location.strip()}%"))

    if status_filter:
        query = query.filter(UserPlant.status.ilike(f"%{status_filter.strip()}%"))

    plants = query.order_by(UserPlant.created_at.desc()).offset(skip).limit(limit).all()
    return [_to_plant_out(p) for p in plants]


@router.post("", response_model=UserPlantOut, status_code=status.HTTP_201_CREATED)
def create_user_plant(
    plant_in: UserPlantCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not plant_in.nickname.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plant nickname is required",
        )

    # If species_id provided, verify it exists
    species = None
    watering_interval = plant_in.watering_interval_days or 7
    fertilization_interval = plant_in.fertilization_interval_days or 30

    if plant_in.species_id:
        species = db.query(Species).filter(Species.id == plant_in.species_id).first()
        if not species:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Species with id '{plant_in.species_id}' not found",
            )
        if not plant_in.watering_interval_days and species.recommended_watering_days:
            watering_interval = species.recommended_watering_days

    now = datetime.now(timezone.utc)
    plant_id = str(uuid.uuid4())
    next_water = now + timedelta(days=watering_interval)
    next_fertilize = now + timedelta(days=fertilization_interval)

    plant = UserPlant(
        id=plant_id,
        user_id=current_user.id,
        species_id=plant_in.species_id,
        nickname=plant_in.nickname.strip(),
        location=plant_in.location or "Living Room",
        photo_url=plant_in.photo_url,
        status=plant_in.status or "Active",
        watering_interval_days=watering_interval,
        fertilization_interval_days=fertilization_interval,
        last_watered_at=now,
        next_water_due=next_water,
        last_fertilized_at=now,
        next_fertilize_due=next_fertilize,
        notifications_enabled=plant_in.notifications_enabled
        if plant_in.notifications_enabled is not None
        else True,
        created_at=now,
        updated_at=now,
    )
    db.add(plant)
    db.flush()

    # Create initial CareLog
    care_log = CareLog(
        id=str(uuid.uuid4()),
        plant_id=plant_id,
        care_type="WATERING",
        performed_at=now,
        notes="Added plant to garden and initiated care tracking.",
        created_at=now,
    )
    db.add(care_log)
    db.commit()
    db.refresh(plant)

    return _to_plant_out(plant)


@router.get("/{plant_id}", response_model=UserPlantOut)
def get_user_plant(
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
            detail=f"Plant with id '{plant_id}' not found in your garden",
        )
    return _to_plant_out(plant)


@router.put("/{plant_id}", response_model=UserPlantOut)
@router.patch("/{plant_id}", response_model=UserPlantOut)
def update_user_plant(
    plant_id: str,
    plant_update: UserPlantUpdate,
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
            detail=f"Plant with id '{plant_id}' not found in your garden",
        )

    update_data = plant_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(plant, field, value)

    # Recalculate next due dates if interval changed and last watered exists
    if "watering_interval_days" in update_data and plant.last_watered_at:
        interval = int(update_data["watering_interval_days"] or 7)
        plant.next_water_due = plant.last_watered_at + timedelta(days=interval)

    plant.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(plant)
    return _to_plant_out(plant)


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
            detail=f"Plant with id '{plant_id}' not found in your garden",
        )
    db.delete(plant)
    db.commit()
    return None


@router.post("/{plant_id}/water", response_model=UserPlantOut)
def water_plant(
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
            detail=f"Plant with id '{plant_id}' not found in your garden",
        )

    now = datetime.now(timezone.utc)
    watered_at = water_req.watered_at if water_req and water_req.watered_at else now
    notes = (water_req.notes if water_req else None) or "Watered via dashboard."

    interval = (
        int(plant.watering_interval_days)
        if plant.watering_interval_days is not None
        else 7
    )
    plant.last_watered_at = watered_at
    plant.next_water_due = watered_at + timedelta(days=interval)
    if str(plant.status) in ["Sick", "overdue"]:
        plant.status = "Active"
    plant.updated_at = now

    care_log = CareLog(
        id=str(uuid.uuid4()),
        plant_id=plant.id,
        care_type="WATERING",
        performed_at=watered_at,
        notes=notes,
        created_at=now,
    )
    db.add(care_log)
    db.commit()
    db.refresh(plant)
    return _to_plant_out(plant)


@router.post("/{plant_id}/fertilize", response_model=UserPlantOut)
def fertilize_plant(
    plant_id: str,
    fertilize_req: Optional[FertilizePlantRequest] = None,
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
            detail=f"Plant with id '{plant_id}' not found in your garden",
        )

    now = datetime.now(timezone.utc)
    fertilized_at = (
        fertilize_req.fertilized_at
        if fertilize_req and fertilize_req.fertilized_at
        else now
    )
    notes = (
        fertilize_req.notes if fertilize_req else None
    ) or "Fertilized via care routine."

    interval = (
        int(plant.fertilization_interval_days)
        if plant.fertilization_interval_days is not None
        else 30
    )
    plant.last_fertilized_at = fertilized_at
    plant.next_fertilize_due = fertilized_at + timedelta(days=interval)
    plant.updated_at = now

    care_log = CareLog(
        id=str(uuid.uuid4()),
        plant_id=plant.id,
        care_type="FERTILIZATION",
        performed_at=fertilized_at,
        notes=notes,
        created_at=now,
    )
    db.add(care_log)
    db.commit()
    db.refresh(plant)
    return _to_plant_out(plant)


@router.post("/{plant_id}/snooze", response_model=UserPlantOut)
def snooze_plant_notifications(
    plant_id: str,
    snooze_req: Optional[SnoozePlantRequest] = None,
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
            detail=f"Plant with id '{plant_id}' not found in your garden",
        )

    hours = snooze_req.snooze_hours if (snooze_req and snooze_req.snooze_hours) else 24
    plant.snoozed_until = datetime.now(timezone.utc) + timedelta(hours=hours)
    plant.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(plant)
    return _to_plant_out(plant)
