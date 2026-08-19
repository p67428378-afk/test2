from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Reminder, Vaccination, User
from server.schemas import ReminderResponse, ReminderProcessResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/reminders", tags=["reminders"])


def ensure_tz(dt: Optional[datetime]) -> Optional[datetime]:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


@router.get("", response_model=List[ReminderResponse])
def list_reminders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    pet_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(Reminder)
    if pet_id:
        query = query.filter(Reminder.pet_id == pet_id)
    if status_filter:
        query = query.filter(Reminder.status == status_filter)

    reminders = (
        query.order_by(Reminder.scheduled_date.asc()).offset(skip).limit(limit).all()
    )
    return reminders


@router.post("/process", response_model=ReminderProcessResponse)
def process_reminders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    # Find vaccinations due in next 30 days or overdue
    upcoming_limit = now + timedelta(days=30)

    vaccinations = (
        db.query(Vaccination).filter(Vaccination.next_due_date.isnot(None)).all()
    )

    processed_reminders = []
    for vax in vaccinations:
        vax_due = ensure_tz(vax.next_due_date)
        if not vax_due or vax_due > upcoming_limit:
            continue

        # Update vaccination status
        if vax_due < now:
            vax.status = "OVERDUE"
        else:
            vax.status = "DUE_SOON"

        # Check if reminder already exists
        existing_reminder = (
            db.query(Reminder)
            .filter(Reminder.vaccination_id == vax.id, Reminder.status == "PENDING")
            .first()
        )

        if not existing_reminder:
            reminder = Reminder(
                pet_id=vax.pet_id,
                vaccination_id=vax.id,
                reminder_type="VACCINATION",
                status="SENT",
                scheduled_date=vax_due,
                sent_at=now,
            )
            db.add(reminder)
            processed_reminders.append(reminder)
        else:
            existing_reminder.status = "SENT"
            existing_reminder.sent_at = now
            processed_reminders.append(existing_reminder)

    db.commit()
    for r in processed_reminders:
        db.refresh(r)

    return ReminderProcessResponse(
        processed_count=len(processed_reminders), reminders=processed_reminders
    )
