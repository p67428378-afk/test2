from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.crud import expense as crud_expense
from server.crud import category as crud_category
from server.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from server.models.expense import Expense

router = APIRouter(prefix="/api/v1/expenses", tags=["Expenses"])


def _to_expense_response(exp: Expense) -> ExpenseResponse:
    return ExpenseResponse(
        id=exp.id,
        title=exp.title,
        amount=exp.amount,
        category_id=exp.category_id,
        category_name=exp.category.name if exp.category else None,
        category_color=exp.category.color if exp.category else None,
        expense_date=exp.expense_date,
        payment_method=exp.payment_method,
        description=exp.description,
        created_at=exp.created_at,
        updated_at=exp.updated_at,
    )


@router.get("", response_model=List[ExpenseResponse])
def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    payment_method: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "date_desc",
    db: Session = Depends(get_db),
):
    expenses = crud_expense.get_expenses(
        db=db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        payment_method=payment_method,
        search=search,
        sort_by=sort_by,
    )
    return [_to_expense_response(e) for e in expenses]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    cat = crud_category.get_category(db, expense_in.category_id)
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id '{expense_in.category_id}' not found",
        )
    exp = crud_expense.create_expense(db, expense_in)
    return _to_expense_response(exp)


@router.get("/{id}", response_model=ExpenseResponse)
def get_expense(id: str, db: Session = Depends(get_db)):
    exp = crud_expense.get_expense(db, id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    return _to_expense_response(exp)


@router.put("/{id}", response_model=ExpenseResponse)
def update_expense(id: str, expense_in: ExpenseUpdate, db: Session = Depends(get_db)):
    exp = crud_expense.get_expense(db, id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    if expense_in.category_id:
        cat = crud_category.get_category(db, expense_in.category_id)
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id '{expense_in.category_id}' not found",
            )
    updated = crud_expense.update_expense(db, exp, expense_in)
    return _to_expense_response(updated)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(id: str, db: Session = Depends(get_db)):
    exp = crud_expense.get_expense(db, id)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    crud_expense.delete_expense(db, exp)
    return None
