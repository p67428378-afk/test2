from typing import List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server import models, schemas
from server.core.deps import get_current_user, require_roles, log_audit

router = APIRouter()

ALLOWED_CATEGORIES = ["PERSONNEL", "EQUIPMENT", "TRAVEL", "INDIRECT"]
DEFAULT_CATEGORY_CAP_PCT = {
    "PERSONNEL": 0.50,  # 50% max
    "EQUIPMENT": 0.30,  # 30% max
    "TRAVEL": 0.15,  # 15% max
    "INDIRECT": 0.20,  # 20% max
}


@router.post(
    "/expense",
    response_model=schemas.ExpenseLogRead,
    status_code=status.HTTP_201_CREATED,
)
def log_expense(
    expense_in: schemas.ExpenseLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles(["RESEARCHER", "GRANT_ADMIN"])),
):
    award = (
        db.query(models.Award).filter(models.Award.id == expense_in.award_id).first()
    )
    if not award:
        # Check if award_id is proposal_id
        award = (
            db.query(models.Award)
            .filter(models.Award.proposal_id == expense_in.award_id)
            .first()
        )

    if not award:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Award not found"
        )

    if current_user.role == "RESEARCHER" and award.proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    category_upper = expense_in.category.upper()
    if category_upper not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category '{expense_in.category}'. Allowed categories: {ALLOWED_CATEGORIES}",
        )

    # Calculate category cap
    cat_cap_pct = DEFAULT_CATEGORY_CAP_PCT.get(category_upper, 0.50)
    cat_cap_amount = expense_in.category_cap or (
        award.allocated_budget * Decimal(str(cat_cap_pct))
    )

    # Calculate existing expense in this category
    existing_cat_expenses = db.query(func.sum(models.ExpenseLog.amount)).filter(
        models.ExpenseLog.award_id == award.id,
        models.ExpenseLog.category == category_upper,
    ).scalar() or Decimal("0.00")

    if existing_cat_expenses + expense_in.amount > cat_cap_amount:
        log_audit(
            db,
            current_user.id,
            "CATEGORY_CAP_VARIANCE_WARNING",
            f"award:{award.id}, category:{category_upper}, cap:{cat_cap_amount}, attempted:{existing_cat_expenses + expense_in.amount}",
        )

    # Check total budget limit
    existing_total = db.query(func.sum(models.ExpenseLog.amount)).filter(
        models.ExpenseLog.award_id == award.id
    ).scalar() or Decimal("0.00")

    if existing_total + expense_in.amount > award.allocated_budget:
        log_audit(
            db,
            current_user.id,
            "BUDGET_CAP_EXCEEDED_WARNING",
            f"award:{award.id}, total_budget:{award.allocated_budget}, attempted:{existing_total + expense_in.amount}",
        )

    expense = models.ExpenseLog(
        award_id=award.id,
        category=category_upper,
        amount=expense_in.amount,
        description=expense_in.description,
        logged_by=current_user.id,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    log_audit(
        db,
        current_user.id,
        "LOG_EXPENSE",
        f"expense_id:{expense.id}, amount:{expense.amount}",
    )
    return expense


@router.get("/{award_id}", response_model=schemas.FinancialReportRead)
def get_financial_report(
    award_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    award = db.query(models.Award).filter(models.Award.id == award_id).first()
    if not award:
        # Check if award_id is proposal_id
        award = (
            db.query(models.Award).filter(models.Award.proposal_id == award_id).first()
        )

    if not award:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Award not found"
        )

    if current_user.role == "RESEARCHER" and award.proposal.pi_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    expenses = (
        db.query(models.ExpenseLog).filter(models.ExpenseLog.award_id == award.id).all()
    )

    total_expenses = sum((e.amount for e in expenses), Decimal("0.00"))
    allocated_budget = award.allocated_budget
    remaining_budget = allocated_budget - total_expenses

    burn_rate_pct = 0.0
    if allocated_budget > Decimal("0.00"):
        burn_rate_pct = round(float((total_expenses / allocated_budget) * 100), 2)

    category_breakdown = {cat: 0.0 for cat in ALLOWED_CATEGORIES}
    category_caps = {
        cat: float(allocated_budget * Decimal(str(DEFAULT_CATEGORY_CAP_PCT[cat])))
        for cat in ALLOWED_CATEGORIES
    }

    for e in expenses:
        category_breakdown[e.category] = float(
            Decimal(str(category_breakdown.get(e.category, 0))) + e.amount
        )

    warnings: List[str] = []
    for cat, spent in category_breakdown.items():
        cap = category_caps[cat]
        if spent > cap:
            warnings.append(
                f"Expense in category '{cat}' (${spent:.2f}) exceeds line-item cap (${cap:.2f})"
            )

    if total_expenses > allocated_budget:
        warnings.append(
            f"Total expenses (${total_expenses:.2f}) exceed allocated budget (${allocated_budget:.2f})"
        )

    return {
        "award_id": award.id,
        "allocated_budget": allocated_budget,
        "total_expenses": total_expenses,
        "remaining_budget": remaining_budget,
        "burn_rate_percentage": burn_rate_pct,
        "category_breakdown": category_breakdown,
        "category_caps": category_caps,
        "cap_variance_warnings": warnings,
        "expenses": expenses,
    }
