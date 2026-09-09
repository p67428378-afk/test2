import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import PlantHealthLog, UserPlant, User
from server.schemas import PlantHealthLogCreate, PlantHealthLogOut
from server.middleware.auth import get_current_user

router = APIRouter(
    prefix="/api/v1/health-logs", tags=["Plant Health & Milestone Observations"]
)

ALLOWED_RATINGS = {"excellent", "good", "fair", "poor"}


@router.get("", response_model=List[PlantHealthLogOut])
def list_health_logs(
    plant_id: Optional[str] = Query(
        None, description="Filter logs for a specific plant"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(PlantHealthLog).filter(PlantHealthLog.user_id == current_user.id)
    if plant_id:
        query = query.filter(PlantHealthLog.plant_id == plant_id)

    logs = (
        query.order_by(PlantHealthLog.logged_at.desc()).offset(skip).limit(limit).all()
    )
    return logs


@router.post("", response_model=PlantHealthLogOut, status_code=status.HTTP_201_CREATED)
def create_health_log(
    log_in: PlantHealthLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plant = (
        db.query(UserPlant)
        .filter(UserPlant.id == log_in.plant_id, UserPlant.user_id == current_user.id)
        .first()
    )
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant with id '{log_in.plant_id}' not found in your garden",
        )

    rating_normalized = log_in.rating.strip().lower()
    if rating_normalized not in ALLOWED_RATINGS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid health rating '{log_in.rating}'. Must be one of: Excellent, Good, Fair, Poor.",
        )

    formatted_rating = rating_normalized.capitalize()
    now = datetime.now(timezone.utc)
    logged_at = log_in.logged_at or now

    health_log = PlantHealthLog(
        id=str(uuid.uuid4()),
        plant_id=plant.id,
        user_id=current_user.id,
        rating=formatted_rating,
        notes=log_in.notes.strip() if log_in.notes else None,
        repotted_flag=bool(log_in.repotted_flag),
        photo_url=log_in.photo_url.strip() if log_in.photo_url else None,
        logged_at=logged_at,
        created_at=now,
    )
    db.add(health_log)

    # Update plant status if repotted or if poor
    if log_in.repotted_flag:
        plant.status = "Repotted"
    elif formatted_rating == "Poor":
        plant.status = "Sick"
    elif formatted_rating in ["Excellent", "Good"] and plant.status == "Sick":
        plant.status = "Active"

    plant.updated_at = now
    db.commit()
    db.refresh(health_log)

    return health_log


@router.get("/{log_id}", response_model=PlantHealthLogOut)
def get_health_log(
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = (
        db.query(PlantHealthLog)
        .filter(PlantHealthLog.id == log_id, PlantHealthLog.user_id == current_user.id)
        .first()
    )
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Health observation log with id '{log_id}' not found",
        )
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_health_log(
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = (
        db.query(PlantHealthLog)
        .filter(PlantHealthLog.id == log_id, PlantHealthLog.user_id == current_user.id)
        .first()
    )
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Health observation log with id '{log_id}' not found",
        )
    db.delete(log)
    db.commit()
    return None
