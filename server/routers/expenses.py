from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from uuid import uuid4

from server.database import get_db
from server.models import Expense, Category
from server import schemas

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/summary", response_model=schemas.ExpenseSummaryResponse)
def get_expense_summary(
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    db: Session = Depends(get_db),
):
    query = db.query(Expense)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)

    expenses = query.all()
    total_expense = sum(e.amount for e in expenses)
    total_transactions = len(expenses)

    # Group by category
    category_totals = {}
    for e in expenses:
        cat_id = e.category_id
        if cat_id not in category_totals:
            cat_name = e.category.name if e.category else "Uncategorized"
            category_totals[cat_id] = {"name": cat_name, "total": 0.0}
        category_totals[cat_id]["total"] += e.amount

    by_category = []
    for cat_id, data in category_totals.items():
        pct = (data["total"] / total_expense * 100.0) if total_expense > 0 else 0.0
        by_category.append(
            schemas.CategorySummary(
                category_id=cat_id,
                category_name=data["name"],
                total_amount=round(data["total"], 2),
                percentage=round(pct, 2),
            )
        )

    # Sort by total amount descending
    by_category.sort(key=lambda x: x.total_amount, reverse=True)

    return schemas.ExpenseSummaryResponse(
        total_expense=round(total_expense, 2),
        total_transactions=total_transactions,
        start_date=start_date,
        end_date=end_date,
        by_category=by_category,
    )


@router.get("", response_model=List[schemas.ExpenseResponse])
def list_expenses(
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    category_id: Optional[str] = Query(None, description="Filter by category ID"),
    search: Optional[str] = Query(
        None, description="Search in description or payment method"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Expense)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    if category_id:
        query = query.filter(Expense.category_id == category_id)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Expense.description.ilike(search_filter))
            | (Expense.payment_method.ilike(search_filter))
        )

    expenses = (
        query.order_by(Expense.date.desc(), Expense.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for e in expenses:
        exp_dict = schemas.ExpenseResponse.model_validate(e)
        exp_dict.category_name = e.category.name if e.category else None
        result.append(exp_dict)

    return result


@router.post(
    "", response_model=schemas.ExpenseResponse, status_code=status.HTTP_201_CREATED
)
def create_expense(expense_in: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == expense_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category_id. Category does not exist.",
        )

    expense = Expense(
        id=str(uuid4()),
        amount=expense_in.amount,
        date=expense_in.date,
        category_id=expense_in.category_id,
        payment_method=expense_in.payment_method,
        description=expense_in.description,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    res = schemas.ExpenseResponse.model_validate(expense)
    res.category_name = category.name
    return res


@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(expense_id: str, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found"
        )
    res = schemas.ExpenseResponse.model_validate(expense)
    res.category_name = expense.category.name if expense.category else None
    return res


@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: str, expense_in: schemas.ExpenseUpdate, db: Session = Depends(get_db)
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found"
        )

    if expense_in.category_id is not None:
        category = (
            db.query(Category).filter(Category.id == expense_in.category_id).first()
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid category_id. Category does not exist.",
            )
        expense.category_id = expense_in.category_id

    if expense_in.amount is not None:
        expense.amount = expense_in.amount
    if expense_in.date is not None:
        expense.date = expense_in.date
    if expense_in.payment_method is not None:
        expense.payment_method = expense_in.payment_method
    if expense_in.description is not None:
        expense.description = expense_in.description

    db.commit()
    db.refresh(expense)

    res = schemas.ExpenseResponse.model_validate(expense)
    res.category_name = expense.category.name if expense.category else None
    return res


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found"
        )
    db.delete(expense)
    db.commit()
    return None
