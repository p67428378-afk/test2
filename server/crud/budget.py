import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from server.models.budget import Budget
from server.models.expense import Expense
from server.schemas.budget import BudgetCreate


def get_budgets(
    db: Session, month: Optional[int] = None, year: Optional[int] = None
) -> List[Budget]:
    query = db.query(Budget).options(joinedload(Budget.category))
    if month is not None:
        query = query.filter(Budget.month == month)
    if year is not None:
        query = query.filter(Budget.year == year)
    return query.order_by(Budget.year.desc(), Budget.month.desc()).all()


def get_budget(db: Session, budget_id: str) -> Optional[Budget]:
    return (
        db.query(Budget)
        .options(joinedload(Budget.category))
        .filter(Budget.id == budget_id)
        .first()
    )


def get_budget_by_category_and_period(
    db: Session, category_id: str, month: int, year: int
) -> Optional[Budget]:
    return (
        db.query(Budget)
        .options(joinedload(Budget.category))
        .filter(
            Budget.category_id == category_id,
            Budget.month == month,
            Budget.year == year,
        )
        .first()
    )


def calculate_category_spent_for_month(
    db: Session, category_id: str, month: int, year: int
) -> float:
    total = (
        db.query(func.coalesce(func.sum(Expense.amount), 0.0))
        .filter(
            Expense.category_id == category_id,
            extract("month", Expense.expense_date) == month,
            extract("year", Expense.expense_date) == year,
        )
        .scalar()
    )
    return float(total or 0.0)


def create_or_update_budget(db: Session, budget_in: BudgetCreate) -> Budget:
    existing = get_budget_by_category_and_period(
        db, budget_in.category_id, budget_in.month, budget_in.year
    )
    if existing:
        existing.monthly_limit = budget_in.monthly_limit
        existing.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_budget = Budget(
            id=str(uuid.uuid4()),
            category_id=budget_in.category_id,
            monthly_limit=budget_in.monthly_limit,
            month=budget_in.month,
            year=budget_in.year,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(new_budget)
        db.commit()
        db.refresh(new_budget)
        return new_budget


def delete_budget(db: Session, budget: Budget) -> None:
    db.delete(budget)
    db.commit()
