from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import schemas, crud

router = APIRouter(prefix="/api/v1/volunteers", tags=["Volunteer Coordination"])


@router.get("", response_model=List[schemas.VolunteerResponse])
def list_volunteers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_volunteers(db, skip=skip, limit=limit)


@router.post(
    "", response_model=schemas.VolunteerResponse, status_code=status.HTTP_201_CREATED
)
def create_volunteer(vol_data: schemas.VolunteerCreate, db: Session = Depends(get_db)):
    return crud.create_volunteer(db, vol_data)


@router.get("/shifts", response_model=List[schemas.VolunteerShiftResponse])
def list_volunteer_shifts(
    zone_name: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.get_volunteer_shifts(db, zone_name=zone_name, status=status)


@router.post(
    "/shifts",
    response_model=schemas.VolunteerShiftResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_volunteer_shift(
    shift_data: schemas.VolunteerShiftCreate, db: Session = Depends(get_db)
):
    return crud.create_volunteer_shift(db, shift_data)


@router.post(
    "/shifts/{shift_id}/check-in", response_model=schemas.VolunteerShiftResponse
)
def check_in_shift(
    shift_id: str,
    req: Optional[schemas.VolunteerShiftCheckInRequest] = None,
    db: Session = Depends(get_db),
):
    vol_id = req.volunteer_id if req else None
    return crud.check_in_volunteer_shift(db, shift_id, volunteer_id=vol_id)


@router.post("/shifts/{shift_id}/drop", response_model=schemas.VolunteerShiftResponse)
def drop_shift(
    shift_id: str,
    req: Optional[schemas.VolunteerShiftDropRequest] = None,
    db: Session = Depends(get_db),
):
    reason = req.reason if req else None
    return crud.drop_volunteer_shift(db, shift_id, reason=reason)


@router.get("/alerts", response_model=List[schemas.StandbyAlertResponse])
def get_standby_alerts(db: Session = Depends(get_db)):
    return crud.get_standby_alerts(db)
