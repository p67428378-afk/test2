from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID, uuid4

from server.database import get_db
from server.app.models.schedule import ScheduleSlot
from server.app.schemas.schedule import (
    ScheduleSlotCreate,
    ScheduleSlotUpdate,
    ScheduleSlotResponse,
)
from server.models import User

router = APIRouter()


# Mock authentication dependency for SCRUM-507
def get_current_user(db: Session = Depends(get_db)) -> User:
    # Find or create a default test user to satisfy authentication
    user = db.query(User).filter(User.login_id == "test@example.com").first()
    if not user:
        user = User(
            id=uuid4(),
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password="dummy_hashed_password",
            security_question="What is your favorite color?",
            security_answer_hash="dummy_answer_hash",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.get("/schedule", response_model=List[ScheduleSlotResponse])
def get_schedule_slots(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    slots = db.query(ScheduleSlot).filter(ScheduleSlot.user_id == current_user.id).all()
    # Sort chronologically by day of week and start time
    day_order = {
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6,
    }
    slots.sort(key=lambda x: (day_order.get(x.day_of_week, 7), x.start_time))
    return slots


@router.post(
    "/schedule",
    response_model=ScheduleSlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule_slot(
    slot_in: ScheduleSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Double check business logic validation
    if slot_in.end_time <= slot_in.start_time:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="End time cannot be earlier than or equal to start time.",
        )

    db_slot = ScheduleSlot(
        user_id=current_user.id,
        title=slot_in.title,
        day_of_week=slot_in.day_of_week,
        start_time=slot_in.start_time,
        end_time=slot_in.end_time,
        notes=slot_in.notes,
    )
    db.add(db_slot)
    db.commit()
    db.refresh(db_slot)
    return db_slot


@router.put("/schedule/{slot_id}", response_model=ScheduleSlotResponse)
def update_schedule_slot(
    slot_id: UUID,
    slot_in: ScheduleSlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_slot = (
        db.query(ScheduleSlot)
        .filter(ScheduleSlot.id == slot_id, ScheduleSlot.user_id == current_user.id)
        .first()
    )
    if not db_slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule slot not found"
        )

    if slot_in.end_time <= slot_in.start_time:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="End time cannot be earlier than or equal to start time.",
        )

    db_slot.title = slot_in.title
    db_slot.day_of_week = slot_in.day_of_week
    db_slot.start_time = slot_in.start_time
    db_slot.end_time = slot_in.end_time
    db_slot.notes = slot_in.notes

    db.commit()
    db.refresh(db_slot)
    return db_slot


@router.delete("/schedule/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule_slot(
    slot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_slot = (
        db.query(ScheduleSlot)
        .filter(ScheduleSlot.id == slot_id, ScheduleSlot.user_id == current_user.id)
        .first()
    )
    if not db_slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule slot not found"
        )
    db.delete(db_slot)
    db.commit()
    return None
