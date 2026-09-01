import uuid
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.models.visitor import Visitor
from server.models.appointment import Appointment
from server.models.inmate import Inmate
from server.models.entry_exit_log import EntryExitLog
from server.schemas.visitor import VisitorCreate


def register_visitor(db: Session, visitor_in: VisitorCreate) -> Visitor:
    existing = (
        db.query(Visitor).filter(Visitor.national_id == visitor_in.national_id).first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visitor account with this ID already exists.",
        )

    visitor = Visitor(
        id=uuid.uuid4(),
        full_name=visitor_in.full_name,
        national_id=visitor_in.national_id,
        email=visitor_in.email,
        phone=visitor_in.phone,
        address=visitor_in.address,
        photo_id_url=visitor_in.photo_id_url,
        verification_status="PENDING",
    )
    db.add(visitor)
    db.commit()
    db.refresh(visitor)
    return visitor


def get_visitor_by_id(db: Session, visitor_id: uuid.UUID) -> Visitor:
    visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor not found.",
        )
    return visitor


def get_visitor_profile(
    db: Session,
    visitor_id: Optional[uuid.UUID] = None,
    national_id: Optional[str] = None,
    email: Optional[str] = None,
) -> Visitor:
    query = db.query(Visitor)
    if visitor_id:
        query = query.filter(Visitor.id == visitor_id)
    elif national_id:
        query = query.filter(Visitor.national_id == national_id)
    elif email:
        query = query.filter(Visitor.email == email)
    else:
        # Default to first visitor if nothing passed (e.g. for testing profile)
        visitor = query.first()
        if not visitor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No visitor profile found.",
            )
        return visitor

    visitor = query.first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visitor profile not found.",
        )
    return visitor


def list_visitors(
    db: Session,
    verification_status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Visitor]:
    query = db.query(Visitor)
    if verification_status:
        query = query.filter(Visitor.verification_status == verification_status)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Visitor.full_name.ilike(search_pattern))
            | (Visitor.national_id.ilike(search_pattern))
            | (Visitor.email.ilike(search_pattern))
        )
    return query.order_by(Visitor.created_at.desc()).offset(skip).limit(limit).all()


def get_visitor_history(db: Session, visitor_id: uuid.UUID) -> List[dict]:
    visitor = get_visitor_by_id(db, visitor_id)
    appointments = (
        db.query(Appointment)
        .filter(Appointment.visitor_id == visitor_id)
        .order_by(Appointment.visit_date.desc(), Appointment.start_time.desc())
        .all()
    )

    history = []
    for appt in appointments:
        inmate = db.query(Inmate).filter(Inmate.id == appt.inmate_id).first()
        log = (
            db.query(EntryExitLog)
            .filter(EntryExitLog.appointment_id == appt.id)
            .order_by(EntryExitLog.created_at.desc())
            .first()
        )

        history.append(
            {
                "id": appt.id,
                "appointment_id": appt.id,
                "visit_date": appt.visit_date,
                "start_time": appt.start_time,
                "inmate_id": appt.inmate_id,
                "inmate_name": inmate.full_name if inmate else "Unknown Inmate",
                "inmate_number": inmate.inmate_number if inmate else "N/A",
                "cell_location": inmate.cell_location if inmate else "N/A",
                "relationship": appt.relationship,
                "status": appt.status,
                "rejection_reason": appt.rejection_reason,
                "check_in_time": log.check_in_time if log else None,
                "check_out_time": log.check_out_time if log else None,
                "officer_id": log.officer_id if log else None,
                "created_at": appt.created_at,
            }
        )
    return history
