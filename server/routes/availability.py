from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server import models, schemas, auth

router = APIRouter(prefix="/availability", tags=["Availability"])


@router.get("", response_model=List[schemas.AvailabilityResponse])
def get_availability(
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    availabilities = (
        db.query(models.Availability)
        .filter(models.Availability.guide_id == current_guide.id)
        .all()
    )
    return availabilities


@router.put("", response_model=dict)
def update_availability(
    request: schemas.AvailabilityUpdate,
    current_guide: models.Guide = Depends(auth.get_current_guide),
    db: Session = Depends(get_db),
):
    # Delete existing availability for this guide
    db.query(models.Availability).filter(
        models.Availability.guide_id == current_guide.id
    ).delete()

    # Add new unavailable dates
    for d in request.unavailable_dates:
        db_avail = models.Availability(guide_id=current_guide.id, unavailable_date=d)
        db.add(db_avail)

    db.commit()

    return {
        "status": "success",
        "unavailable_dates": [
            d.strftime("%Y-%m-%d") for d in request.unavailable_dates
        ],
    }
