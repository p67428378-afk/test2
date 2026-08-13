from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from server import models


def is_equipment_available(
    db: Session,
    equipment_id: str,
    start_date: datetime,
    end_date: datetime,
    exclude_rental_id: str = None,
) -> bool:
    """
    Check if equipment is available during [start_date, end_date].
    Excludes rentals that are RETURNED or CANCELLED.
    """
    # Normalize timezones
    if start_date.tzinfo is None:
        start_date = start_date.replace(tzinfo=timezone.utc)
    if end_date.tzinfo is None:
        end_date = end_date.replace(tzinfo=timezone.utc)

    # First check equipment status
    equipment = (
        db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    )
    if not equipment:
        return False
    if equipment.status == "MAINTENANCE":
        return False

    # Check overlapping active/reserved rentals
    query = db.query(models.Rental).filter(
        models.Rental.equipment_id == equipment_id,
        models.Rental.status.in_(["RESERVED", "CHECKED_OUT", "ACTIVE", "OVERDUE"]),
        # Overlap condition: start1 < end2 AND end1 > start2
        models.Rental.start_date < end_date,
        models.Rental.end_date > start_date,
    )

    if exclude_rental_id:
        query = query.filter(models.Rental.id != exclude_rental_id)

    overlapping = query.first()
    return overlapping is None


def reserve_equipment_with_lock(
    db: Session, equipment_id: str, expected_version: int
) -> models.Equipment:
    """
    Optimistic locking check when reserving equipment.
    Raises 409 Conflict if version mismatch occurs.
    """
    equipment = (
        db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    )
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found"
        )

    if equipment.status == "MAINTENANCE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Equipment is currently under maintenance",
        )

    if equipment.version != expected_version:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Equipment was modified concurrently by another transaction. Please retry.",
        )

    # Increment version
    equipment.version += 1
    db.commit()
    db.refresh(equipment)
    return equipment


def release_expired_reservations(db: Session, timeout_minutes: int = 15) -> int:
    """
    Release reservations in RESERVED status that have no completed deposit transaction
    and were created more than `timeout_minutes` ago.
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(minutes=timeout_minutes)

    expired_rentals = (
        db.query(models.Rental)
        .filter(models.Rental.status == "RESERVED", models.Rental.created_at < cutoff)
        .all()
    )

    count = 0
    for rental in expired_rentals:
        # Check if there is a completed DEPOSIT transaction
        deposit_tx = (
            db.query(models.Transaction)
            .filter(
                models.Transaction.rental_id == rental.id,
                models.Transaction.transaction_type == "DEPOSIT",
                models.Transaction.status == "COMPLETED",
            )
            .first()
        )

        if not deposit_tx:
            rental.status = "CANCELLED"
            # Restore equipment status if RESERVED
            eq = (
                db.query(models.Equipment)
                .filter(models.Equipment.id == rental.equipment_id)
                .first()
            )
            if eq and eq.status == "RESERVED":
                eq.status = "AVAILABLE"
            count += 1

    if count > 0:
        db.commit()

    return count
