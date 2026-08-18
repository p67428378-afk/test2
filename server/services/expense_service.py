from datetime import date
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from server.models.expense import Expense
from server.models.category import Category
from server.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseListResponse,
    ExpenseSummaryResponse,
    CategoryExpenseSummary,
)


def _to_expense_response(expense: Expense) -> ExpenseResponse:
    category_name = expense.category.name if expense.category else None
    return ExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        date=expense.date,
        category_id=expense.category_id,
        category_name=category_name,
        payment_method=expense.payment_method,
        description=expense.description,
        created_at=expense.created_at,
        updated_at=expense.updated_at,
    )


def create_expense(db: Session, expense_in: ExpenseCreate) -> ExpenseResponse:
    category = db.query(Category).filter(Category.id == expense_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID '{expense_in.category_id}' not found.",
        )

    if expense_in.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense amount must be greater than 0.",
        )

    expense = Expense(
        amount=expense_in.amount,
        date=expense_in.date,
        category_id=expense_in.category_id,
        payment_method=expense_in.payment_method,
        description=expense_in.description,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return _to_expense_response(expense)


def get_expenses(
    db: Session,
    category_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> ExpenseListResponse:
    query = db.query(Expense).join(Category)

    if category_id:
        query = query.filter(Expense.category_id == category_id)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Expense.description.ilike(search_pattern))
            | (Expense.payment_method.ilike(search_pattern))
            | (Category.name.ilike(search_pattern))
        )

    total = query.count()
    items = query.order_by(Expense.date.desc(), Expense.created_at.desc()).offset(skip).limit(limit).all()

    response_items = [_to_expense_response(item) for item in items]
    return ExpenseListResponse(total=total, skip=skip, limit=limit, items=response_items)


def get_expense_by_id(db: Session, expense_id: str) -> ExpenseResponse:
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found.",
        )
    return _to_expense_response(expense)


def update_expense(db: Session, expense_id: str, expense_in: ExpenseUpdate) -> ExpenseResponse:
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found.",
        )

    if expense_in.category_id is not None:
        category = db.query(Category).filter(Category.id == expense_in.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID '{expense_in.category_id}' not found.",
            )
        expense.category_id = expense_in.category_id

    if expense_in.amount is not None:
        if expense_in.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Expense amount must be greater than 0.",
            )
        expense.amount = expense_in.amount

    if expense_in.date is not None:
        expense.date = expense_in.date
    if expense_in.payment_method is not None:
        expense.payment_method = expense_in.payment_method
    if expense_in.description is not None:
        expense.description = expense_in.description

    db.commit()
    db.refresh(expense)
    return _to_expense_response(expense)


def delete_expense(db: Session, expense_id: str) -> None:
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found.",
        )
    db.delete(expense)
    db.commit()


def get_expense_summary(
    db: Session, start_date: Optional[date] = None, end_date: Optional[date] = None
) -> ExpenseSummaryResponse:
    query = db.query(Expense)

    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)

    expenses = query.all()
    total_expense = sum(e.amount for e in expenses)

    # Aggregation by category
    summary_query = db.query(
        Expense.category_id,
        Category.name.label("category_name"),
        func.sum(Expense.amount).label("cat_total"),
    ).join(Category, Expense.category_id == Category.id)

    if start_date:
        summary_query = summary_query.filter(Expense.date >= start_date)
    if end_date:
        summary_query = summary_query.filter(Expense.date <= end_date)

    summary_rows = summary_query.group_by(Expense.category_id, Category.name).all()

    by_category = []
    for row in summary_rows:
        cat_amount = float(row.cat_total or 0.0)
        percentage = round((cat_amount / total_expense) * 100, 2) if total_expense > 0 else 0.0
        by_category.append(
            CategoryExpenseSummary(
                category_id=row.category_id,
                category_name=row.category_name,
                total_amount=round(cat_amount, 2),
                percentage=percentage,
            )
        )

    return ExpenseSummaryResponse(
        total_expense=round(total_expense, 2),
        start_date=start_date.isoformat() if start_date else None,
        end_date=end_date.isoformat() if end_date else None,
        by_category=by_category,
    )
