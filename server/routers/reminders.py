from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import (
    ReminderCreate,
    ReminderOut,
    ReminderProcessResult,
)
from server.crud import (
    get_reminders,
    create_reminder,
    process_due_reminders,
    get_pet,
)

router = APIRouter(prefix="/api/v1/reminders", tags=["reminders"])


@router.get("", response_model=List[ReminderOut])
def list_reminders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    pet_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    return get_reminders(
        db=db,
        skip=skip,
        limit=limit,
        pet_id=pet_id,
        status=status_filter,
    )


@router.post("", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
def schedule_reminder(rem_in: ReminderCreate, db: Session = Depends(get_db)):
    pet = get_pet(db=db, pet_id=rem_in.pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{rem_in.pet_id}' not found",
        )
    return create_reminder(db=db, rem_in=rem_in)


@router.post("/process", response_model=ReminderProcessResult)
def run_automated_reminders(db: Session = Depends(get_db)):
    count = process_due_reminders(db=db)
    return {
        "message": f"Successfully evaluated and dispatched {count} reminders",
        "processed_count": count,
    }
