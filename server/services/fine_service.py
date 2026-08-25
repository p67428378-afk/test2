import random
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.models import Fine
from server.schemas import FineCreate, FineUpdate
from server.services import audit_service


def generate_ticket_number(db: Session) -> str:
    while True:
        num = random.randint(10000, 99999)
        ticket_number = f"FN-{num}"
        existing = db.query(Fine).filter(Fine.ticket_number == ticket_number).first()
        if not existing:
            return ticket_number


def check_and_update_overdue(db: Session, fine: Fine) -> Fine:
    now_utc = datetime.now(timezone.utc)
    # Ensure due_date is offset-aware for comparison
    due_date = fine.due_date
    if due_date.tzinfo is None:
        due_date = due_date.replace(tzinfo=timezone.utc)

    if fine.status == "UNPAID" and due_date < now_utc:
        fine.status = "OVERDUE"
        db.commit()
        db.refresh(fine)
    return fine


def search_fines(
    db: Session,
    license_plate: Optional[str] = None,
    ticket_number: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[Fine]:
    if not license_plate and not ticket_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide license_plate or ticket_number to search",
        )

    query = db.query(Fine)
    filters = []
    if license_plate:
        filters.append(Fine.license_plate.ilike(f"%{license_plate.strip()}%"))
    if ticket_number:
        filters.append(Fine.ticket_number.ilike(f"%{ticket_number.strip()}%"))

    query = query.filter(or_(*filters))
    fines = query.offset(skip).limit(limit).all()

    if not fines:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No parking fine records found for the provided details",
        )

    for f in fines:
        check_and_update_overdue(db, f)

    return fines


def get_fine_status_details(db: Session, fine_id: str) -> dict:
    fine = (
        db.query(Fine)
        .filter(or_(Fine.id == fine_id, Fine.ticket_number == fine_id))
        .first()
    )
    if not fine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parking fine record not found",
        )

    check_and_update_overdue(db, fine)

    now_utc = datetime.now(timezone.utc)
    due_date = fine.due_date
    if due_date.tzinfo is None:
        due_date = due_date.replace(tzinfo=timezone.utc)

    overdue_penalty = 0.0
    if fine.status == "OVERDUE" or (fine.status == "UNPAID" and due_date < now_utc):
        overdue_penalty = 15.00

    total_due = (
        fine.amount + overdue_penalty
        if fine.status != "PAID" and fine.status != "VOIDED"
        else 0.0
    )

    return {
        "id": fine.id,
        "ticket_number": fine.ticket_number,
        "status": fine.status,
        "amount": fine.amount,
        "overdue_penalty": overdue_penalty,
        "total_due": total_due,
        "due_date": fine.due_date,
    }


def create_fine(db: Session, fine_in: FineCreate, actor_id: str) -> Fine:
    if fine_in.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fine amount must be greater than zero",
        )

    ticket_num = generate_ticket_number(db)
    issue_date = fine_in.issue_date or datetime.now(timezone.utc)

    fine = Fine(
        ticket_number=ticket_num,
        license_plate=fine_in.license_plate.strip().upper(),
        violation_type=fine_in.violation_type.strip(),
        location=fine_in.location.strip(),
        amount=fine_in.amount,
        status="UNPAID",
        issue_date=issue_date,
        due_date=fine_in.due_date,
    )
    db.add(fine)
    db.commit()
    db.refresh(fine)

    audit_service.create_log(
        db=db,
        fine_id=fine.id,
        actor_id=actor_id,
        action="CREATE",
        notes=f"Issued ticket {ticket_num} for plate {fine.license_plate}",
    )

    return fine


def update_fine(db: Session, fine_id: str, fine_in: FineUpdate, actor_id: str) -> Fine:
    fine = db.query(Fine).filter(Fine.id == fine_id).first()
    if not fine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parking fine record not found",
        )

    changes = []
    if fine_in.status is not None:
        new_status = (
            fine_in.status.value if hasattr(fine_in.status, "value") else fine_in.status
        )
        changes.append(f"status: {fine.status} -> {new_status}")
        fine.status = new_status
        if new_status == "PAID" and fine.payment_timestamp is None:
            fine.payment_timestamp = datetime.now(timezone.utc)

    if fine_in.amount is not None:
        changes.append(f"amount: {fine.amount} -> {fine_in.amount}")
        fine.amount = fine_in.amount

    if fine_in.transaction_reference is not None:
        fine.transaction_reference = fine_in.transaction_reference
        changes.append(f"txn_ref: {fine_in.transaction_reference}")

    db.commit()
    db.refresh(fine)

    notes_text = fine_in.notes or ", ".join(changes) or "Updated fine details"
    audit_service.create_log(
        db=db,
        fine_id=fine.id,
        actor_id=actor_id,
        action="UPDATE_STATUS",
        notes=notes_text,
    )

    return fine


def void_fine(db: Session, fine_id: str, notes: str, actor_id: str) -> Fine:
    if not notes or not notes.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Void justification notes are required",
        )

    fine = db.query(Fine).filter(Fine.id == fine_id).first()
    if not fine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parking fine record not found",
        )

    fine.status = "VOIDED"
    db.commit()
    db.refresh(fine)

    audit_service.create_log(
        db=db,
        fine_id=fine.id,
        actor_id=actor_id,
        action="VOID",
        notes=f"Citation voided: {notes.strip()}",
    )

    return fine


def list_all_fines(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = None,
    license_plate: Optional[str] = None,
) -> List[Fine]:
    query = db.query(Fine)
    if status_filter:
        query = query.filter(Fine.status == status_filter)
    if license_plate:
        query = query.filter(Fine.license_plate.ilike(f"%{license_plate.strip()}%"))

    fines = query.order_by(Fine.created_at.desc()).offset(skip).limit(limit).all()
    for f in fines:
        check_and_update_overdue(db, f)
    return fines
