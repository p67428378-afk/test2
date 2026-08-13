from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models, schemas
from server.auth import get_current_active_user

router = APIRouter(prefix="/api/v1/deposits", tags=["Deposits & Holds"])


@router.post("/hold", response_model=schemas.TransactionResponse, status_code=200)
def create_deposit_hold(
    hold_in: schemas.DepositHoldCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    rental = (
        db.query(models.Rental).filter(models.Rental.id == hold_in.rental_id).first()
    )
    if not rental:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rental record not found"
        )

    # Check permission
    if current_user.role.upper() != "ADMIN" and rental.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform deposit operations on this rental",
        )

    # Create transaction for deposit hold
    transaction = models.Transaction(
        rental_id=rental.id,
        transaction_type="DEPOSIT",
        amount=hold_in.amount,
        status="COMPLETED",
        payment_gateway_ref=f"gw_hold_{hold_in.payment_method_id or 'default'}",
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction
