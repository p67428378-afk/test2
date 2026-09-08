from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload

from server.database import get_db
from server.models import User, Transaction, Category
from server.schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionOut,
    TransactionListResponse,
)
from server.auth import get_current_user

router = APIRouter()


@router.get("", response_model=TransactionListResponse)
def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    start_date: Optional[date] = Query(
        None, description="Start date filter YYYY-MM-DD"
    ),
    end_date: Optional[date] = Query(None, description="End date filter YYYY-MM-DD"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    type: Optional[str] = Query(
        None, description="Filter by transaction type: Income or Expense"
    ),
    transaction_type: Optional[str] = Query(
        None, description="Alternative filter for transaction type"
    ),
    payment_method: Optional[str] = Query(None, description="Filter by payment method"),
    search: Optional[str] = Query(None, description="Search keyword in description"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.user_id == current_user.id)
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)

    filter_type = type or transaction_type
    if filter_type:
        query = query.filter(Transaction.transaction_type == filter_type)

    if payment_method:
        query = query.filter(Transaction.payment_method == payment_method)

    if search:
        query = query.filter(Transaction.description.ilike(f"%{search}%"))

    total = query.count()
    items = (
        query.order_by(Transaction.date.desc(), Transaction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return TransactionListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    tx_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if tx_in.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Transaction amount must be greater than zero",
        )

    if tx_in.category_id:
        category = (
            db.query(Category)
            .filter(
                Category.id == tx_in.category_id,
                Category.user_id == current_user.id,
            )
            .first()
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category does not exist or does not belong to user",
            )

    new_tx = Transaction(
        user_id=current_user.id,
        category_id=tx_in.category_id,
        amount=tx_in.amount,
        transaction_type=tx_in.transaction_type,
        payment_method=tx_in.payment_method,
        date=tx_in.date,
        description=tx_in.description,
        receipt_url=tx_in.receipt_url,
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)

    # Reload with category relationship
    tx = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.id == new_tx.id)
        .first()
    )
    return tx


@router.get("/{transaction_id}", response_model=TransactionOut)
def get_expense(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
        .first()
    )
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    return tx


@router.put("/{transaction_id}", response_model=TransactionOut)
def update_expense(
    transaction_id: str,
    tx_in: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    if tx_in.amount is not None:
        if tx_in.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Transaction amount must be greater than zero",
            )
        tx.amount = tx_in.amount

    if tx_in.category_id is not None:
        if tx_in.category_id != "":
            category = (
                db.query(Category)
                .filter(
                    Category.id == tx_in.category_id,
                    Category.user_id == current_user.id,
                )
                .first()
            )
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category does not exist or does not belong to user",
                )
            tx.category_id = tx_in.category_id
        else:
            tx.category_id = None

    if tx_in.date is not None:
        tx.date = tx_in.date
    if tx_in.transaction_type is not None:
        tx.transaction_type = tx_in.transaction_type
    if tx_in.payment_method is not None:
        tx.payment_method = tx_in.payment_method
    if tx_in.description is not None:
        tx.description = tx_in.description
    if tx_in.receipt_url is not None:
        tx.receipt_url = tx_in.receipt_url

    db.commit()
    db.refresh(tx)

    updated_tx = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.id == tx.id)
        .first()
    )
    return updated_tx


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    db.delete(tx)
    db.commit()
    return None
