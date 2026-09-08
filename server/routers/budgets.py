from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import extract

from server.database import get_db
from server.models import User, Budget, Category, Transaction
from server.schemas import BudgetCreate, BudgetStatusOut, BudgetOut
from server.auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[BudgetStatusOut])
def get_budgets(
    month: Optional[str] = Query(None, description="Month in YYYY-MM format"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    target_month = month or datetime.now().strftime("%Y-%m")
    try:
        year_str, month_str = target_month.split("-")
        target_year = int(year_str)
        target_month_int = int(month_str)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Month must be in YYYY-MM format",
        )

    budgets = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == target_month,
        )
        .all()
    )

    results = []
    for b in budgets:
        # Sum expenses for this user, category, and month
        spent_total = (
            db.query(Transaction)
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.category_id == b.category_id,
                Transaction.transaction_type == "Expense",
                extract("year", Transaction.date) == target_year,
                extract("month", Transaction.date) == target_month_int,
            )
            .all()
        )
        spent = sum(t.amount for t in spent_total)
        percentage = (
            round((spent / b.monthly_limit) * 100, 2) if b.monthly_limit > 0 else 0.0
        )

        if percentage >= 100.0:
            alert_level = "BREACHED"
        elif percentage >= 80.0:
            alert_level = "WARNING"
        else:
            alert_level = "NORMAL"

        category = db.query(Category).filter(Category.id == b.category_id).first()
        category_name = category.name if category else "Unknown Category"

        results.append(
            BudgetStatusOut(
                id=b.id,
                category_id=b.category_id,
                category_name=category_name,
                monthly_limit=b.monthly_limit,
                month=b.month,
                spent=spent,
                percentage=percentage,
                alert_level=alert_level,
            )
        )

    return results


@router.post("", response_model=BudgetOut, status_code=status.HTTP_201_CREATED)
def set_budget(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if budget_in.monthly_limit <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Monthly limit must be greater than zero",
        )

    category = (
        db.query(Category)
        .filter(
            Category.id == budget_in.category_id,
            Category.user_id == current_user.id,
        )
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category does not exist or does not belong to user",
        )

    existing_budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.category_id == budget_in.category_id,
            Budget.month == budget_in.month,
        )
        .first()
    )

    if existing_budget:
        existing_budget.monthly_limit = budget_in.monthly_limit
        db.commit()
        db.refresh(existing_budget)
        return existing_budget

    new_budget = Budget(
        user_id=current_user.id,
        category_id=budget_in.category_id,
        monthly_limit=budget_in.monthly_limit,
        month=budget_in.month,
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    budget = (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == current_user.id,
        )
        .first()
    )

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    db.delete(budget)
    db.commit()
    return None
