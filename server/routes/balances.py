from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.schemas.leave_balance import UserBalanceResponse, BalanceItem
from server.services.leave_service import get_or_create_user_balances

router = APIRouter(prefix="/balances", tags=["Balances"])


@router.get("/{user_id}", response_model=UserBalanceResponse)
def get_user_leave_balance(
    user_id: str,
    year: int = Query(default_factory=lambda: datetime.now().year),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{user_id}' not found.",
        )

    balances = get_or_create_user_balances(db, user_id, year)
    balance_items = [
        BalanceItem(
            leave_type=b.leave_type,
            allocated_days=b.allocated_days,
            used_days=b.used_days,
            remaining_days=b.remaining_days,
        )
        for b in balances
    ]

    return UserBalanceResponse(
        user_id=user_id,
        year=year,
        balances=balance_items,
    )
