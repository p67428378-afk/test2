from datetime import date, timedelta
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from server import models
from server.services.watchlist_service import screen_national_id


def get_week_range(target_date: date) -> Tuple[date, date]:
    """Returns (start_of_week_monday, end_of_week_sunday) for a given date."""
    start_of_week = target_date - timedelta(days=target_date.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    return start_of_week, end_of_week


def validate_and_create_appointment(
    db: Session,
    visitor: models.Visitor,
    inmate: models.Inmate,
    visit_date: date,
    start_time,
    slot_duration_minutes: int,
    relationship: str,
) -> Tuple[Optional[models.Appointment], str]:
    """
    Validates weekly quota and duration, checks watchlist status, and returns (Appointment, error_message).
    """
    # 1. Determine Quota Limit
    is_legal = (
        visitor.visitor_type.upper() == "LEGAL"
        or "ATTORNEY" in visitor.visitor_type.upper()
    )

    # Standard: default 2 (or inmate.weekly_visit_limit); Legal: up to 5
    max_weekly_limit = 5 if is_legal else inmate.weekly_visit_limit

    # 2. Check existing visits for this inmate in this week
    start_week, end_week = get_week_range(visit_date)
    existing_count = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.inmate_id == inmate.id,
            models.Appointment.visit_date >= start_week,
            models.Appointment.visit_date <= end_week,
            models.Appointment.status.in_(["PENDING", "APPROVED", "COMPLETED"]),
        )
        .count()
    )

    if existing_count >= max_weekly_limit:
        return (
            None,
            f"Weekly visit limit reached for inmate ({existing_count}/{max_weekly_limit} visits this week).",
        )

    # 3. Validate slot duration
    if is_legal:
        if slot_duration_minutes not in [30, 60]:
            slot_duration_minutes = 60
    else:
        slot_duration_minutes = 30

    # 4. Check watchlist status
    is_flagged, _ = screen_national_id(db, visitor.national_id, visitor.full_name)
    security_flag = (
        "FLAGGED" if (is_flagged or visitor.is_watchlist_flagged) else "CLEARED"
    )

    # 5. Create Appointment
    appointment = models.Appointment(
        visitor_id=visitor.id,
        inmate_id=inmate.id,
        visit_date=visit_date,
        start_time=start_time,
        slot_duration_minutes=slot_duration_minutes,
        relationship=relationship,
        status="PENDING",
        security_flag_status=security_flag,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment, ""
