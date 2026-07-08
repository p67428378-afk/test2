from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server import models, schemas, crud
from server.api.v1.endpoints.users import get_current_user
from server.services.investment_service import investment_service
from datetime import date, datetime
from decimal import Decimal
import math

router = APIRouter(prefix="/roundups", tags=["roundups"])


@router.get("/summary", response_model=schemas.RoundupSummaryResponse)
def get_roundup_summary(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # Total roundup amount (sum of all roundups from transactions with status 'Invested')
    total_roundup = db.query(func.sum(models.Transaction.roundup_amount)).filter(
        models.Transaction.user_id == current_user.id
    ).filter(models.Transaction.status == "Invested").scalar() or Decimal("0.00")

    # Today's invested amount (sum of roundup_investments for today with status 'Invested')
    today = date.today()
    today_invested = db.query(
        func.sum(models.RoundupInvestment.aggregated_amount)
    ).filter(models.RoundupInvestment.user_id == current_user.id).filter(
        models.RoundupInvestment.investment_date == today
    ).filter(models.RoundupInvestment.status == "Invested").scalar() or Decimal("0.00")

    return schemas.RoundupSummaryResponse(
        is_roundup_enabled=current_user.is_roundup_enabled,
        today_invested_amount=float(today_invested),
        total_roundup_amount=float(total_roundup),
    )


@router.get("/transactions", response_model=schemas.TransactionListResponse)
def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    )
    total = query.count()
    items = (
        query.order_by(
            models.Transaction.transaction_date.desc(),
            models.Transaction.created_at.desc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

    return schemas.TransactionListResponse(items=items, total=total)


@router.post("/calculate", response_model=schemas.RoundupCalculationResponse)
def calculate_roundup(
    request: schemas.RoundupCalculationRequest,
    current_user: models.User = Depends(get_current_user),
):
    amount = request.transaction_amount
    if amount <= 0:
        raise HTTPException(
            status_code=422, detail="Transaction amount must be greater than 0"
        )

    # Calculate raw roundup
    # e.g. 42.35 -> next whole dollar is 43.00 -> roundup is 0.65
    # e.g. 5.00 -> next whole dollar is 5.00 -> roundup is 0.00
    fractional, whole = math.modf(amount)
    if fractional == 0:
        raw_roundup = 0.0
    else:
        raw_roundup = round(1.0 - fractional, 2)

    is_whole_dollar_catch_all_applied = False
    final_roundup = raw_roundup

    if raw_roundup == 0.0 and current_user.is_whole_dollar_catch_all_enabled:
        final_roundup = 1.0
        is_whole_dollar_catch_all_applied = True

    # Apply multiplier
    multiplier = current_user.roundup_multiplier
    final_roundup_amount = round(final_roundup * multiplier, 2)

    return schemas.RoundupCalculationResponse(
        transaction_amount=amount,
        raw_roundup=raw_roundup,
        applied_multiplier=multiplier,
        is_whole_dollar_catch_all_applied=is_whole_dollar_catch_all_applied,
        final_roundup_amount=final_roundup_amount,
    )


@router.post("/trigger-daily-job", response_model=schemas.DailyJobTriggerResponse)
def trigger_daily_job(db: Session = Depends(get_db)):
    """
    Daily scheduled job trigger.
    Sums up all 'Pending' round-up amounts from a 24-hour period for enabled users
    and executes a single investment transaction per user.
    Also updates milestone achievements.
    """
    enabled_users = db.query(models.User).filter(models.User.is_roundup_enabled).all()
    processed_users_count = 0
    total_invested_amount = Decimal("0.00")

    for user in enabled_users:
        # Get all pending transactions for this user
        pending_txs = (
            db.query(models.Transaction)
            .filter(models.Transaction.user_id == user.id)
            .filter(models.Transaction.status == "Pending")
            .all()
        )

        if not pending_txs:
            continue

        # Sum up round-up amounts
        aggregated_amount = sum(tx.roundup_amount for tx in pending_txs)

        if aggregated_amount > 0:
            try:
                # Execute investment
                success = investment_service.execute_investment(
                    str(user.id), float(aggregated_amount)
                )
                if success:
                    # Record the investment
                    investment = models.RoundupInvestment(
                        user_id=user.id,
                        aggregated_amount=aggregated_amount,
                        investment_date=date.today(),
                        status="Invested",
                    )
                    db.add(investment)

                    # Update transaction statuses to 'Invested'
                    for tx in pending_txs:
                        tx.status = "Invested"

                    db.commit()
                    processed_users_count += 1
                    total_invested_amount += aggregated_amount

                    # Check and update milestones
                    # Total roundup amount (sum of all roundups from transactions with status 'Invested')
                    total_roundup = db.query(
                        func.sum(models.Transaction.roundup_amount)
                    ).filter(models.Transaction.user_id == user.id).filter(
                        models.Transaction.status == "Invested"
                    ).scalar() or Decimal("0.00")

                    # Ensure default milestones exist
                    milestones = crud.get_user_milestones(db, str(user.id))
                    if not milestones:
                        milestones = crud.create_default_milestones(db, str(user.id))

                    for m in milestones:
                        if not m.is_achieved and total_roundup >= m.target_amount:
                            m.is_achieved = True
                            m.achieved_at = datetime.now()
                    db.commit()

            except Exception:
                # Log failure and record failed investment
                investment = models.RoundupInvestment(
                    user_id=user.id,
                    aggregated_amount=aggregated_amount,
                    investment_date=date.today(),
                    status="Failed",
                )
                db.add(investment)
                db.commit()

    return schemas.DailyJobTriggerResponse(
        status="Success",
        processed_users_count=processed_users_count,
        total_invested_amount=float(total_invested_amount),
    )
