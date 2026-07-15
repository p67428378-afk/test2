from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
from server.database import get_db
from server.models import User, Appointment, VisitLog
from server.schemas import (
    CheckInRequest,
    CheckOutRequest,
    VisitLogResponse,
    VisitHistoryResponse,
)
from server.auth import get_current_user, require_role

router = APIRouter()


@router.post("/check-in", response_model=VisitLogResponse)
def check_in_visitor(
    payload: CheckInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["security"])),
):
    # Get appointment
    appt = (
        db.query(Appointment).filter(Appointment.id == payload.appointment_id).first()
    )
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Check if appointment is approved
    if appt.status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Appointment is not approved, or visitor is flagged.",
        )

    # Check if visitor is flagged
    if appt.visitor.is_flagged:
        raise HTTPException(
            status_code=400,
            detail="Appointment is not approved, or visitor is flagged.",
        )

    # Check if already checked in
    existing_log = (
        db.query(VisitLog)
        .filter(VisitLog.appointment_id == appt.id, VisitLog.status == "checked-in")
        .first()
    )
    if existing_log:
        raise HTTPException(status_code=400, detail="Visitor is already checked in")

    # Create visit log
    new_log = VisitLog(
        appointment_id=appt.id, check_in_time=datetime.utcnow(), status="checked-in"
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.post("/check-out", response_model=VisitLogResponse)
def check_out_visitor(
    payload: CheckOutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["security"])),
):
    log = db.query(VisitLog).filter(VisitLog.id == payload.visit_log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Active visit log not found.")

    if log.status != "checked-in":
        raise HTTPException(
            status_code=400, detail="Visit log is not in checked-in status"
        )

    log.check_out_time = datetime.utcnow()
    log.status = "completed"
    db.commit()
    db.refresh(log)
    return log


@router.get("/history/{inmate_id}", response_model=List[VisitHistoryResponse])
def get_visit_history(
    inmate_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        inmate_uuid = uuid.UUID(inmate_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid inmate ID format")

    # Get all appointments for this inmate
    appts = db.query(Appointment).filter(Appointment.inmate_id == inmate_uuid).all()
    appt_ids = [a.id for a in appts]

    # Get all visit logs for these appointments
    logs = db.query(VisitLog).filter(VisitLog.appointment_id.in_(appt_ids)).all()

    results = []
    for log in logs:
        results.append(
            VisitHistoryResponse(
                id=log.id,
                visitor_name=log.appointment.visitor.full_name,
                check_in_time=log.check_in_time,
                check_out_time=log.check_out_time,
                status=log.status,
            )
        )
    return results
