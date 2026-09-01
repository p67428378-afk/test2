from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import DoctorSlot, User
from server.schemas import DoctorSlotCreate, DoctorSlotResponse
from server.app.auth.utils import require_roles

router = APIRouter(prefix="/doctors", tags=["Doctors & Slots"])


@router.post(
    "/slots", response_model=DoctorSlotResponse, status_code=status.HTTP_201_CREATED
)
def create_doctor_slot(
    slot_in: DoctorSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Doctor", "Staff")),
):
    doctor = db.query(User).filter(User.id == slot_in.doctor_id).first()
    if not doctor or doctor.role != "Doctor":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specified user is not a valid doctor",
        )

    if slot_in.start_time >= slot_in.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slot start_time must be before end_time",
        )

    # Check for slot overlap for the same doctor
    overlap = (
        db.query(DoctorSlot)
        .filter(
            DoctorSlot.doctor_id == slot_in.doctor_id,
            DoctorSlot.start_time < slot_in.end_time,
            DoctorSlot.end_time > slot_in.start_time,
        )
        .first()
    )
    if overlap:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A slot overlapping with the given time already exists for this doctor",
        )

    slot = DoctorSlot(
        doctor_id=slot_in.doctor_id,
        department=slot_in.department,
        start_time=slot_in.start_time,
        end_time=slot_in.end_time,
        is_booked=False,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


@router.get("/slots", response_model=List[DoctorSlotResponse])
def list_slots(
    department: Optional[str] = Query(None, description="Filter by department"),
    doctor_id: Optional[str] = Query(None, description="Filter by doctor UUID"),
    is_booked: Optional[bool] = Query(None, description="Filter by booking status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(DoctorSlot)
    if department:
        query = query.filter(DoctorSlot.department.ilike(f"%{department}%"))
    if doctor_id:
        query = query.filter(DoctorSlot.doctor_id == doctor_id)
    if is_booked is not None:
        query = query.filter(DoctorSlot.is_booked == is_booked)

    slots = query.order_by(DoctorSlot.start_time.asc()).offset(skip).limit(limit).all()
    return slots


@router.get("/{doctor_id}/slots", response_model=List[DoctorSlotResponse])
def get_doctor_slots(
    doctor_id: str,
    is_booked: Optional[bool] = Query(None, description="Filter by booked status"),
    db: Session = Depends(get_db),
):
    query = db.query(DoctorSlot).filter(DoctorSlot.doctor_id == doctor_id)
    if is_booked is not None:
        query = query.filter(DoctorSlot.is_booked == is_booked)
    slots = query.order_by(DoctorSlot.start_time.asc()).all()
    return slots
