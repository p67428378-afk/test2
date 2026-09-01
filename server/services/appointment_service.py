import uuid
from datetime import date, timedelta
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.models.appointment import Appointment
from server.models.inmate import Inmate
from server.models.visitor import Visitor
from server.schemas.appointment import AppointmentCreate, AppointmentStatusUpdate


def get_calendar_week_range(d: date) -> tuple[date, date]:
    monday = d - timedelta(days=d.weekday())
    sunday = monday + timedelta(days=6)
    return monday, sunday


def get_inmate_weekly_visits_count(
    db: Session,
    inmate_id: uuid.UUID,
    visit_date: date,
    exclude_appointment_id: Optional[uuid.UUID] = None,
) -> int:
    monday, sunday = get_calendar_week_range(visit_date)
    query = db.query(Appointment).filter(
        Appointment.inmate_id == inmate_id,
        Appointment.visit_date >= monday,
        Appointment.visit_date <= sunday,
        Appointment.status.in_(["APPROVED", "COMPLETED"]),
    )
    if exclude_appointment_id:
        query = query.filter(Appointment.id != exclude_appointment_id)
    return query.count()


def create_appointment(db: Session, appointment_in: AppointmentCreate) -> Appointment:
    visitor = db.query(Visitor).filter(Visitor.id == appointment_in.visitor_id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found.",
        )

    inmate = db.query(Inmate).filter(Inmate.id == appointment_in.inmate_id).first()
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inmate not found.",
        )
    if inmate.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inmate is currently inactive and ineligible for visits.",
        )

    # Check weekly quota (max 2 visits per week)
    approved_count = get_inmate_weekly_visits_count(
        db, inmate.id, appointment_in.visit_date
    )
    if approved_count >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inmate has reached maximum 2 visits per week limit.",
        )

    appointment = Appointment(
        id=uuid.uuid4(),
        visitor_id=appointment_in.visitor_id,
        inmate_id=appointment_in.inmate_id,
        visit_date=appointment_in.visit_date,
        start_time=appointment_in.start_time,
        relationship_to_inmate=appointment_in.relationship,
        status="PENDING",
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def update_appointment_status(
    db: Session, appointment_id: uuid.UUID, status_update: AppointmentStatusUpdate
) -> Appointment:
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    target_status = status_update.status.upper()
    if target_status not in [
        "APPROVED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
        "PENDING",
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid appointment status: {status_update.status}",
        )

    if target_status == "APPROVED":
        # Rule 3: Visitor must be VERIFIED
        visitor = db.query(Visitor).filter(Visitor.id == appointment.visitor_id).first()
        if not visitor or visitor.verification_status != "VERIFIED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unverified identity status blocks appointment approval.",
            )

        # Rule 2: Check quota again
        approved_count = get_inmate_weekly_visits_count(
            db,
            appointment.inmate_id,
            appointment.visit_date,
            exclude_appointment_id=appointment.id,
        )
        if approved_count >= 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inmate has reached maximum 2 visits per week limit.",
            )

    appointment.status = target_status
    if status_update.rejection_reason is not None:
        appointment.rejection_reason = status_update.rejection_reason
    db.commit()
    db.refresh(appointment)
    return appointment


def get_appointment_by_id(db: Session, appointment_id: uuid.UUID) -> Appointment:
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )
    return appointment


def list_appointments(
    db: Session,
    status_filter: Optional[str] = None,
    visit_date: Optional[date] = None,
    inmate_id: Optional[uuid.UUID] = None,
    visitor_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Appointment]:
    query = db.query(Appointment)
    if status_filter:
        query = query.filter(Appointment.status == status_filter.upper())
    if visit_date:
        query = query.filter(Appointment.visit_date == visit_date)
    if inmate_id:
        query = query.filter(Appointment.inmate_id == inmate_id)
    if visitor_id:
        query = query.filter(Appointment.visitor_id == visitor_id)

    return (
        query.order_by(Appointment.visit_date.desc(), Appointment.start_time.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
