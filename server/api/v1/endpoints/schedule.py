from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()

# Default seeded user ID for mock authentication/testing
DEFAULT_USER_ID = uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6")


def get_current_user_id(
    user_id: Optional[uuid.UUID] = Query(
        None, description="Optional user UUID to filter by (for mock auth/testing)"
    ),
) -> uuid.UUID:
    """
    Helper dependency to get the current user ID.
    If user_id is provided in query, use it. Otherwise, default to the seeded user ID.
    """
    return user_id or DEFAULT_USER_ID


@router.get("/schedule-slots", response_model=List[schemas.ScheduleSlotResponse])
def read_schedule_slots(
    db: Session = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Retrieves all schedule slots for the authenticated user.
    """
    # Ensure the user exists in the database (idempotent seed if not exists)
    user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not user:
        user = models.User(
            id=current_user_id,
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password="hashed_testpassword",
            security_question="What is your favorite color?",
            security_answer_hash="hashed_blue",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return crud.get_schedule_slots(db, user_id=current_user_id)


@router.post(
    "/schedule-slots",
    response_model=schemas.ScheduleSlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule_slot(
    slot: schemas.ScheduleSlotCreate,
    db: Session = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    """
    Creates a new schedule slot.
    """
    # Ensure the user exists
    user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not user:
        user = models.User(
            id=current_user_id,
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password="hashed_testpassword",
            security_question="What is your favorite color?",
            security_answer_hash="hashed_blue",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return crud.create_schedule_slot(db, slot=slot, user_id=current_user_id)


@router.put("/schedule-slots/{slot_id}", response_model=schemas.ScheduleSlotResponse)
def update_schedule_slot(
    slot_id: uuid.UUID,
    slot_update: schemas.ScheduleSlotUpdate,
    db: Session = Depends(get_db),
):
    """
    Updates an existing schedule slot.
    """
    db_slot = crud.get_schedule_slot(db, slot_id=slot_id)
    if not db_slot:
        raise HTTPException(status_code=404, detail="Schedule slot not found")
    return crud.update_schedule_slot(db, db_slot=db_slot, slot_update=slot_update)


@router.delete("/schedule-slots/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule_slot(slot_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Deletes a schedule slot.
    """
    db_slot = crud.get_schedule_slot(db, slot_id=slot_id)
    if not db_slot:
        raise HTTPException(status_code=404, detail="Schedule slot not found")
    crud.delete_schedule_slot(db, db_slot=db_slot)
    return None


@router.patch(
    "/schedule-slots/{slot_id}/toggle-completion",
    response_model=schemas.ScheduleSlotResponse,
)
def toggle_schedule_slot_completion(slot_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Toggles the is_completed status of a schedule slot.
    """
    db_slot = crud.get_schedule_slot(db, slot_id=slot_id)
    if not db_slot:
        raise HTTPException(status_code=404, detail="Schedule slot not found")
    return crud.toggle_schedule_slot_completion(db, db_slot=db_slot)
