from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_
from typing import Optional
from uuid import UUID
from datetime import datetime, time
from server import schemas, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/transactions", response_model=schemas.TransactionListResponse)
def get_transactions(
    account_id: Optional[UUID] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    type: Optional[str] = None,  # "Incoming" or "Outgoing"
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all accounts of the user
    user_accounts = db.query(models.Account).filter(models.Account.user_id == current_user.id).all()
    user_account_ids = [acc.id for acc in user_accounts]
    
    if not user_account_ids:
        return schemas.TransactionListResponse(items=[], total=0, skip=skip, limit=limit)

    # If account_id is specified, verify it belongs to the user
    if account_id and account_id not in user_account_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    # Aliases for joining accounts to get account numbers
    from_account_alias = aliased(models.Account)
    to_account_alias = aliased(models.Account)

    # Base query
    query = db.query(
        models.Transaction,
        from_account_alias.account_number.label("from_account_number"),
        to_account_alias.account_number.label("to_account_number")
    ).join(
        to_account_alias, models.Transaction.to_account_id == to_account_alias.id
    ).outerjoin(
        from_account_alias, models.Transaction.from_account_id == from_account_alias.id
    )

    # Filter by user's accounts
    if account_id:
        if type == "Incoming":
            query = query.filter(models.Transaction.to_account_id == account_id)
        elif type == "Outgoing":
            query = query.filter(models.Transaction.from_account_id == account_id)
        else:
            query = query.filter(
                or_(
                    models.Transaction.from_account_id == account_id,
                    models.Transaction.to_account_id == account_id
                )
            )
    else:
        if type == "Incoming":
            query = query.filter(models.Transaction.to_account_id.in_(user_account_ids))
        elif type == "Outgoing":
            query = query.filter(models.Transaction.from_account_id.in_(user_account_ids))
        else:
            query = query.filter(
                or_(
                    models.Transaction.from_account_id.in_(user_account_ids),
                    models.Transaction.to_account_id.in_(user_account_ids)
                )
            )

    # Filter by date range
    if start_date:
        try:
            start_dt = datetime.combine(datetime.strptime(start_date, "%Y-%m-%d").date(), time.min)
            query = query.filter(models.Transaction.created_at >= start_dt)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid start_date format. Use YYYY-MM-DD"
            )
    if end_date:
        try:
            end_dt = datetime.combine(datetime.strptime(end_date, "%Y-%m-%d").date(), time.max)
            query = query.filter(models.Transaction.created_at <= end_dt)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid end_date format. Use YYYY-MM-DD"
            )

    # Order by created_at descending (most recent first)
    query = query.order_by(models.Transaction.created_at.desc())

    # Get total count
    total = query.count()

    # Paginate
    results = query.offset(skip).limit(limit).all()

    # Map to response schema
    items = []
    for row in results:
        tx, from_num, to_num = row
        
        # Determine direction
        if account_id:
            direction = "Incoming" if tx.to_account_id == account_id else "Outgoing"
        else:
            if tx.to_account_id in user_account_ids and tx.from_account_id not in user_account_ids:
                direction = "Incoming"
            else:
                direction = "Outgoing"

        items.append(
            schemas.TransactionItem(
                id=tx.id,
                from_account_id=tx.from_account_id,
                from_account_number=from_num,
                to_account_id=tx.to_account_id,
                to_account_number=to_num,
                amount=float(tx.amount),
                type=tx.type,
                direction=direction,
                memo=tx.memo,
                created_at=tx.created_at
            )
        )

    return schemas.TransactionListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit
    )
