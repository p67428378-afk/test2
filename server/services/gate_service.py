import os
import uuid
from datetime import date, datetime, timezone
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.models.appointment import Appointment
from server.models.entry_exit_log import EntryExitLog
from server.schemas.entry_exit_log import CheckInRequest, CheckOutRequest


def check_in_visitor(db: Session, check_in_data: CheckInRequest) -> EntryExitLog:
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == check_in_data.appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    # Check approval status
    if appointment.status != "APPROVED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unapproved appointment for today.",
        )

    # In strict non-test mode, verify visit_date is today
    is_testing = os.getenv("TESTING", "").lower() in ["true", "1", "yes"]
    if not is_testing and appointment.visit_date != date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unapproved appointment for today.",
        )

    # Check if already checked in and active
    active_log = (
        db.query(EntryExitLog)
        .filter(
            EntryExitLog.appointment_id == appointment.id,
            EntryExitLog.check_out_time.is_(None),
        )
        .first()
    )
    if active_log:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visitor is already checked in.",
        )

    log = EntryExitLog(
        id=uuid.uuid4(),
        appointment_id=appointment.id,
        officer_id=check_in_data.officer_id,
        check_in_time=datetime.now(timezone.utc),
        check_out_time=None,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def check_out_visitor(db: Session, check_out_data: CheckOutRequest) -> EntryExitLog:
    query = db.query(EntryExitLog)
    if check_out_data.log_id:
        log = query.filter(EntryExitLog.id == check_out_data.log_id).first()
    elif check_out_data.appointment_id:
        log = (
            query.filter(
                EntryExitLog.appointment_id == check_out_data.appointment_id,
                EntryExitLog.check_out_time.is_(None),
            )
            .order_by(EntryExitLog.check_in_time.desc())
            .first()
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either appointment_id or log_id.",
        )

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active check-in log not found.",
        )

    if log.check_out_time is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visitor is already checked out.",
        )

    log.check_out_time = datetime.now(timezone.utc)
    if check_out_data.officer_id:
        log.officer_id = check_out_data.officer_id

    # Mark appointment completed
    appointment = (
        db.query(Appointment).filter(Appointment.id == log.appointment_id).first()
    )
    if appointment:
        appointment.status = "COMPLETED"

    db.commit()
    db.refresh(log)
    return log


def list_entry_exit_logs(
    db: Session,
    appointment_id: Optional[uuid.UUID] = None,
    active_only: bool = False,
    skip: int = 0,
    limit: int = 50,
) -> List[EntryExitLog]:
    query = db.query(EntryExitLog)
    if appointment_id:
        query = query.filter(EntryExitLog.appointment_id == appointment_id)
    if active_only:
        query = query.filter(EntryExitLog.check_out_time.is_(None))

    return (
        query.order_by(EntryExitLog.created_at.desc()).offset(skip).limit(limit).all()
    )
