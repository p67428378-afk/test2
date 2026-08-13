from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models, schemas
from server.auth import get_current_active_user, require_admin
from server.services.rental_service import (
    is_equipment_available,
    reserve_equipment_with_lock,
)
from server.services.fee_calculator import (
    calculate_rental_fee,
    calculate_preauth_amount,
)
from server.services.notification_service import (
    check_and_trigger_reminders,
    check_and_flag_overdue,
)

router = APIRouter(prefix="/api/v1/rentals", tags=["Rental Lifecycle"])


@router.post("", response_model=schemas.RentalResponse, status_code=201)
def create_rental_reservation(
    rental_in: schemas.RentalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    equipment = (
        db.query(models.Equipment)
        .filter(models.Equipment.id == rental_in.equipment_id)
        .first()
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

    # Verify availability
    if not is_equipment_available(
        db, equipment.id, rental_in.start_date, rental_in.end_date
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Equipment is not available for the requested date range",
        )

    # Perform optimistic locking on equipment
    reserve_equipment_with_lock(db, equipment.id, expected_version=equipment.version)

    # Create rental record
    rental = models.Rental(
        user_id=current_user.id,
        equipment_id=equipment.id,
        start_date=rental_in.start_date,
        end_date=rental_in.end_date,
        status="RESERVED",
        payment_method_token=rental_in.payment_method_token or "pm_mock_token",
    )
    db.add(rental)
    db.commit()
    db.refresh(rental)

    # Create initial pre-authorization transaction record
    rental_fee = calculate_rental_fee(
        rental_in.start_date, rental_in.end_date, equipment.daily_rate
    )
    preauth_amount = calculate_preauth_amount(rental_fee, equipment.deposit_amount)

    deposit_tx = models.Transaction(
        rental_id=rental.id,
        transaction_type="DEPOSIT",
        amount=preauth_amount,
        status="COMPLETED",
        payment_gateway_ref=f"gw_hold_{rental.id[:8]}",
    )
    db.add(deposit_tx)
    db.commit()

    return rental


@router.get("", response_model=List[schemas.RentalResponse])
def list_rentals(
    user_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    query = db.query(models.Rental)

    # Non-admin users can only view their own rentals
    if current_user.role.upper() != "ADMIN":
        query = query.filter(models.Rental.user_id == current_user.id)
    elif user_id:
        query = query.filter(models.Rental.user_id == user_id)

    if status_filter:
        query = query.filter(models.Rental.status == status_filter.upper())

    rentals = query.offset(skip).limit(limit).all()
    return rentals


@router.patch("/{rental_id}/status", response_model=schemas.RentalResponse)
def transition_rental_status(
    rental_id: str,
    status_in: schemas.RentalStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    rental = db.query(models.Rental).filter(models.Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rental record not found"
        )

    # Check permission (User can manage own, Admin can manage any)
    if current_user.role.upper() != "ADMIN" and rental.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this rental",
        )

    new_status = status_in.status.upper()
    valid_statuses = [
        "RESERVED",
        "CHECKED_OUT",
        "ACTIVE",
        "RETURNED",
        "OVERDUE",
        "CANCELLED",
    ]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )

    rental.status = new_status

    # Synchronize equipment status
    equipment = (
        db.query(models.Equipment)
        .filter(models.Equipment.id == rental.equipment_id)
        .first()
    )
    if equipment:
        if new_status in ["CHECKED_OUT", "ACTIVE"]:
            equipment.status = "CHECKED_OUT"
        elif new_status in ["RETURNED", "CANCELLED"]:
            equipment.status = "AVAILABLE"

    db.commit()
    db.refresh(rental)
    return rental


@router.post("/notifications/trigger-reminders")
def trigger_24h_reminders(
    db: Session = Depends(get_db), admin_user: models.User = Depends(require_admin)
):
    """Trigger automated 24-hour return deadline reminder notifications."""
    notifications = check_and_trigger_reminders(db)
    return {
        "status": "success",
        "triggered_count": len(notifications),
        "reminders": notifications,
    }


@router.post("/notifications/check-overdue")
def trigger_overdue_check(
    db: Session = Depends(get_db), admin_user: models.User = Depends(require_admin)
):
    """Scan and flag active rentals past due date as OVERDUE."""
    flagged = check_and_flag_overdue(db)
    return {
        "status": "success",
        "flagged_count": len(flagged),
        "overdue_rentals": flagged,
    }
