from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import DoctorSchedule, User
from server.schemas import DoctorScheduleCreate, DoctorScheduleResponse
from server.security import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/schedules", tags=["Doctor Schedules"])


@router.get("/doctors/{doctor_id}", response_model=List[DoctorScheduleResponse])
def get_doctor_schedule(
    doctor_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get available shift schedules for a specific doctor."""
    schedules = (
        db.query(DoctorSchedule).filter(DoctorSchedule.doctor_id == doctor_id).all()
    )
    return schedules


@router.post(
    "/doctors/{doctor_id}",
    response_model=DoctorScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor_schedule(
    doctor_id: str,
    schedule_in: DoctorScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["Admin", "Doctor"])),
):
    """Create or update a doctor's shift schedule."""
    doctor = db.query(User).filter(User.id == doctor_id, User.role == "Doctor").first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found."
        )

    schedule = DoctorSchedule(
        doctor_id=doctor_id,
        day_of_week=schedule_in.day_of_week,
        start_time=schedule_in.start_time,
        end_time=schedule_in.end_time,
        slot_duration_minutes=schedule_in.slot_duration_minutes,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule
