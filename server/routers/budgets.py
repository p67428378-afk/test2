from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import budget as crud_budget
from server.crud import category as crud_category
from server.schemas.budget import BudgetCreate, BudgetResponse
from server.models.budget import Budget

router = APIRouter(prefix="/api/v1/budgets", tags=["Budgets"])


def _to_budget_response(b: Budget, db: Session) -> BudgetResponse:
    spent = crud_budget.calculate_category_spent_for_month(
        db, b.category_id, b.month, b.year
    )
    rem = round(b.monthly_limit - spent, 2)
    pct = round((spent / b.monthly_limit * 100), 2) if b.monthly_limit > 0 else 0.0

    return BudgetResponse(
        id=b.id,
        category_id=b.category_id,
        category_name=b.category.name if b.category else None,
        category_color=b.category.color if b.category else None,
        monthly_limit=b.monthly_limit,
        month=b.month,
        year=b.year,
        total_spent=round(spent, 2),
        remaining_balance=rem,
        utilization_percentage=pct,
        created_at=b.created_at,
        updated_at=b.updated_at,
    )


@router.get("", response_model=List[BudgetResponse])
def get_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020),
    db: Session = Depends(get_db),
):
    budgets = crud_budget.get_budgets(db, month=month, year=year)
    return [_to_budget_response(b, db) for b in budgets]


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_budget(budget_in: BudgetCreate, db: Session = Depends(get_db)):
    cat = crud_category.get_category(db, budget_in.category_id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id '{budget_in.category_id}' not found",
        )
    budget = crud_budget.create_or_update_budget(db, budget_in)
    return _to_budget_response(budget, db)


@router.get("/{id}", response_model=BudgetResponse)
def get_budget(id: str, db: Session = Depends(get_db)):
    budget = crud_budget.get_budget(db, id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )
    return _to_budget_response(budget, db)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(id: str, db: Session = Depends(get_db)):
    budget = crud_budget.get_budget(db, id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )
    crud_budget.delete_budget(db, budget)
    return None
