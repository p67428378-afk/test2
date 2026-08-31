from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import Expense, ExpenseSplit, Group
from server.schemas import ExpenseCreate, ExpenseResponse, ExpenseSplitResponse
from server.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["Expenses"])


def _format_expense_response(expense: Expense) -> ExpenseResponse:
    splits_formatted = [
        ExpenseSplitResponse(
            id=s.id,
            expense_id=s.expense_id,
            member_id=s.member_id,
            member_name=s.member.name if s.member else None,
            split_value=float(s.split_value),
            computed_amount=float(s.computed_amount),
        )
        for s in expense.splits
    ]

    return ExpenseResponse(
        id=expense.id,
        group_id=expense.group_id,
        title=expense.title,
        total_amount=float(expense.total_amount),
        payer_id=expense.payer_id,
        payer_name=expense.payer.name if expense.payer else None,
        category=expense.category,
        split_type=expense.split_type,
        expense_date=expense.expense_date,
        created_at=expense.created_at,
        updated_at=expense.updated_at,
        splits=splits_formatted,
    )


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    expense = ExpenseService.create_expense(db=db, expense_data=expense_in)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record expense: {str(e)}",
        )

    # Refresh with eager-loaded relationships
    db_expense = (
        db.query(Expense)
        .options(
            joinedload(Expense.payer),
            joinedload(Expense.splits).joinedload(ExpenseSplit.member),
        )
        .filter(Expense.id == expense.id)
        .first()
    )
    return _format_expense_response(db_expense)


@router.get("", response_model=List[ExpenseResponse])
def list_expenses(
    group_id: Optional[str] = Query(None, description="Optional filter by group ID"),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=500, description="Limit for pagination"),
    db: Session = Depends(get_db),
):
    query = db.query(Expense).options(
        joinedload(Expense.payer),
        joinedload(Expense.splits).joinedload(ExpenseSplit.member),
    )

    if group_id:
        # Verify group exists
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group with ID {group_id} not found.",
            )
        query = query.filter(Expense.group_id == group_id)

    expenses = (
        query.order_by(Expense.expense_date.desc(), Expense.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_format_expense_response(e) for e in expenses]


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: str, db: Session = Depends(get_db)):
    expense = (
        db.query(Expense)
        .options(
            joinedload(Expense.payer),
            joinedload(Expense.splits).joinedload(ExpenseSplit.member),
        )
        .filter(Expense.id == expense_id)
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID {expense_id} not found.",
        )

    return _format_expense_response(expense)
