from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import RenewalReminderOut
from server.auth import get_current_user
from server.services import process_reminders, get_reminders

router = APIRouter(prefix="/api/v1/reminders", tags=["Reminders"])


@router.get("", response_model=List[RenewalReminderOut])
@router.get("/", response_model=List[RenewalReminderOut])
def list_reminders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return get_reminders(db)


@router.post("/process", response_model=Dict[str, Any])
def trigger_reminder_processing(db: Session = Depends(get_db)):
    return process_reminders(db)
