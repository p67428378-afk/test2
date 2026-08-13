from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models, schemas
from server.auth import require_admin
from server.services.fee_calculator import calculate_return_settlement

router = APIRouter(prefix="/api/v1/returns", tags=["Returns & Check-In"])


@router.post("/check-in", response_model=schemas.ReturnCheckInResponse)
def process_return_check_in(
    checkin_in: schemas.ReturnCheckInRequest,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    rental = (
        db.query(models.Rental).filter(models.Rental.id == checkin_in.rental_id).first()
    )
    if not rental:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rental record not found"
        )

    equipment = (
        db.query(models.Equipment)
        .filter(models.Equipment.id == rental.equipment_id)
        .first()
    )
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Equipment record not found"
        )

    actual_return_date = checkin_in.actual_return_date or datetime.now(timezone.utc)

    # Compute settlement
    settlement = calculate_return_settlement(
        start_date=rental.start_date,
        end_date=rental.end_date,
        actual_return_date=actual_return_date,
        daily_rate=equipment.daily_rate,
        deposit_amount=equipment.deposit_amount,
        damage_assessment=checkin_in.damage_assessment_amount,
    )

    # Update rental
    rental.actual_return_date = actual_return_date
    rental.status = "RETURNED"

    # Update equipment status
    if checkin_in.damage_assessment_amount > 0:
        equipment.status = "MAINTENANCE"
    else:
        equipment.status = "AVAILABLE"

    # Record transactions
    created_txs = []

    # Rental Fee Transaction
    tx_rental_fee = models.Transaction(
        rental_id=rental.id,
        transaction_type="RENTAL_FEE",
        amount=settlement["rental_fee"],
        status="COMPLETED",
        payment_gateway_ref=f"gw_fee_{rental.id[:8]}",
    )
    db.add(tx_rental_fee)
    created_txs.append(tx_rental_fee)

    # Late Fee Transaction if applicable
    if settlement["late_fee"] > 0:
        tx_late_fee = models.Transaction(
            rental_id=rental.id,
            transaction_type="LATE_FEE",
            amount=settlement["late_fee"],
            status="COMPLETED",
            payment_gateway_ref=f"gw_late_{rental.id[:8]}",
        )
        db.add(tx_late_fee)
        created_txs.append(tx_late_fee)

    # Deposit Refund Transaction if applicable
    if settlement["refund_amount"] > 0:
        tx_refund = models.Transaction(
            rental_id=rental.id,
            transaction_type="REFUND",
            amount=settlement["refund_amount"],
            status="COMPLETED",
            payment_gateway_ref=f"gw_refund_{rental.id[:8]}",
        )
        db.add(tx_refund)
        created_txs.append(tx_refund)

    db.commit()
    for tx in created_txs:
        db.refresh(tx)

    return schemas.ReturnCheckInResponse(
        rental_id=rental.id,
        status="RETURNED",
        days_rented=settlement["days_rented"],
        days_late=settlement["days_late"],
        daily_rate=equipment.daily_rate,
        rental_fee=settlement["rental_fee"],
        deposit_amount=settlement["deposit_amount"],
        late_fee=settlement["late_fee"],
        damage_assessment=settlement["damage_assessment"],
        total_deductions=settlement["total_deductions"],
        refund_amount=settlement["refund_amount"],
        excess_charged=settlement["excess_charged"],
        transactions=created_txs,
    )
