from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from typing import List
from server.database import get_db
from server.models import VisitLog, Appointment, Inmate, Visitor
from server.schemas import (
    CheckInRequest,
    CheckInResponse,
    CheckOutRequest,
    CheckOutResponse,
    InmateHistoryResponse,
)
from server.api.v1.endpoints.auth import get_current_user_payload

router = APIRouter()


@router.post("/visits/check-in", response_model=CheckInResponse)
def check_in_visitor(
    request: CheckInRequest,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user_payload),
):
    officer_id = payload.get("sub")
    role = payload.get("role")

    if role != "security":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden (Security only)"
        )

    appointment = (
        db.query(Appointment).filter(Appointment.id == request.appointment_id).first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if appointment.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Appointment not approved"
        )

    # Check if already checked in
    existing_log = (
        db.query(VisitLog)
        .filter(VisitLog.appointment_id == request.appointment_id)
        .first()
    )
    if existing_log:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Visitor already checked in"
        )

    new_log = VisitLog(
        appointment_id=request.appointment_id,
        check_in_time=datetime.utcnow(),
        supervising_officer_id=UUID(officer_id),
        notes=request.notes,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.post("/visits/check-out", response_model=CheckOutResponse)
def check_out_visitor(
    request: CheckOutRequest,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user_payload),
):
    role = payload.get("role")

    if role != "security":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden (Security only)"
        )

    visit_log = db.query(VisitLog).filter(VisitLog.id == request.visit_log_id).first()
    if not visit_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visit log not found"
        )

    if visit_log.check_out_time is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visitor already checked out",
        )

    visit_log.check_out_time = datetime.utcnow()
    if request.notes:
        visit_log.notes = (visit_log.notes or "") + " | " + request.notes
    db.commit()
    db.refresh(visit_log)
    return visit_log


@router.get("/inmates/{id}/history", response_model=List[InmateHistoryResponse])
def get_inmate_history(
    id: UUID,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user_payload),
):
    role = payload.get("role")
    if role not in ["staff", "security"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden (Staff/Security only)",
        )

    inmate = db.query(Inmate).filter(Inmate.id == id).first()
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inmate not found"
        )

    # Query visit logs for this inmate
    logs = (
        db.query(VisitLog).join(Appointment).filter(Appointment.inmate_id == id).all()
    )

    history = []
    for log in logs:
        visitor = (
            db.query(Visitor).filter(Visitor.id == log.appointment.visitor_id).first()
        )
        history.append(
            {
                "id": log.id,
                "check_in_time": log.check_in_time,
                "check_out_time": log.check_out_time,
                "notes": log.notes,
                "visitor_name": visitor.full_name if visitor else "Unknown",
            }
        )
    return history
