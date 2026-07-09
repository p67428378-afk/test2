from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server.database import get_db
from server.models import User, Expense
from server.schemas import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from server.auth import get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])

DEFAULT_CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Other",
]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_data: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate category
    if expense_data.category not in DEFAULT_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid category. Allowed categories are: {', '.join(DEFAULT_CATEGORIES)}",
        )

    new_expense = Expense(
        user_id=current_user.id,
        amount=expense_data.amount,
        category=expense_data.category,
        description=expense_data.description,
        expense_date=expense_data.expense_date,
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


@router.get("", response_model=List[ExpenseResponse])
def list_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.expense_date.desc(), Expense.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return expenses


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: UUID,
    expense_data: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found or does not belong to user",
        )

    update_dict = expense_data.dict(exclude_unset=True)

    if "category" in update_dict:
        if update_dict["category"] not in DEFAULT_CATEGORIES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid category. Allowed categories are: {', '.join(DEFAULT_CATEGORIES)}",
            )

    for key, value in update_dict.items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_200_OK)
def delete_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found or does not belong to user",
        )

    db.delete(expense)
    db.commit()
    return {"detail": "Expense deleted successfully"}
