from datetime import datetime, timedelta, timezone
from typing import List
from sqlalchemy.orm import Session
from server import models


def check_and_trigger_reminders(db: Session) -> List[dict]:
    """
    Find rentals ending in the next 24 hours in ACTIVE or CHECKED_OUT status,
    and simulate sending notification alerts.
    """
    now = datetime.now(timezone.utc)
    twenty_four_hours_later = now + timedelta(hours=24)

    rentals = (
        db.query(models.Rental)
        .filter(
            models.Rental.status.in_(["ACTIVE", "CHECKED_OUT"]),
            models.Rental.end_date >= now,
            models.Rental.end_date <= twenty_four_hours_later,
        )
        .all()
    )

    notifications = []
    for rental in rentals:
        notifications.append(
            {
                "rental_id": rental.id,
                "user_id": rental.user_id,
                "type": "24H_RETURN_REMINDER",
                "message": f"Reminder: Rental {rental.id} is due on {rental.end_date.isoformat()}.",
                "timestamp": now.isoformat(),
            }
        )
    return notifications


def check_and_flag_overdue(db: Session) -> List[dict]:
    """
    Find rentals past their end_date that are still ACTIVE/CHECKED_OUT/RESERVED,
    and update their status to OVERDUE.
    """
    now = datetime.now(timezone.utc)

    overdue_rentals = (
        db.query(models.Rental)
        .filter(
            models.Rental.status.in_(["ACTIVE", "CHECKED_OUT", "RESERVED"]),
            models.Rental.end_date < now,
        )
        .all()
    )

    flagged = []
    for rental in overdue_rentals:
        rental.status = "OVERDUE"
        flagged.append(
            {
                "rental_id": rental.id,
                "user_id": rental.user_id,
                "status": "OVERDUE",
                "flagged_at": now.isoformat(),
            }
        )

    if overdue_rentals:
        db.commit()

    return flagged
