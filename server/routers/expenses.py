from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Group, GroupMember, Expense, ExpenseSplit
from server.schemas import ExpenseCreate, ExpenseResponse
from server.services.balance_service import calculate_splits

router = APIRouter(prefix="/api/v1/expenses", tags=["Expenses"])


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense_in: ExpenseCreate, db: Session = Depends(get_db)):
    """Record a group expense with itemized split allocations."""
    # 1. Verify group exists
    group = db.query(Group).filter(Group.id == expense_in.group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID '{expense_in.group_id}' not found.",
        )

    # 2. Verify payer belongs to the group
    payer = (
        db.query(GroupMember)
        .filter(
            GroupMember.id == expense_in.payer_id,
            GroupMember.group_id == expense_in.group_id,
        )
        .first()
    )
    if not payer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payer with ID '{expense_in.payer_id}' is not a valid member of group '{expense_in.group_id}'.",
        )

    # 3. Verify all participants in splits belong to the group
    participant_ids = [s.member_id for s in expense_in.splits]
    existing_members = (
        db.query(GroupMember)
        .filter(
            GroupMember.id.in_(participant_ids),
            GroupMember.group_id == expense_in.group_id,
        )
        .all()
    )
    existing_member_ids = {m.id for m in existing_members}
    for m_id in participant_ids:
        if m_id not in existing_member_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Participant with ID '{m_id}' is not a member of group '{expense_in.group_id}'.",
            )

    # 4. Calculate / validate splits
    try:
        calculated_splits = calculate_splits(
            split_type=expense_in.split_type,
            total_amount=expense_in.total_amount,
            splits_input=expense_in.splits,
        )
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))

    # 5. Create expense and splits in an atomic transaction
    try:
        expense = Expense(
            group_id=expense_in.group_id,
            title=expense_in.title,
            total_amount=round(expense_in.total_amount, 2),
            payer_id=expense_in.payer_id,
            split_type=expense_in.split_type,
            date=expense_in.date,
            category=expense_in.category,
            description=expense_in.description,
        )
        db.add(expense)
        db.flush()

        for split_data in calculated_splits:
            split = ExpenseSplit(
                expense_id=expense.id,
                member_id=split_data["member_id"],
                share_amount=split_data["share_amount"],
                percentage=split_data["percentage"],
            )
            db.add(split)

        db.commit()
        db.refresh(expense)
        return expense
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record expense: {str(e)}",
        )


@router.get("", response_model=List[ExpenseResponse])
def list_expenses(
    group_id: Optional[str] = Query(None, description="Filter expenses by group ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List expenses with optional group filtering and pagination."""
    query = db.query(Expense)
    if group_id:
        query = query.filter(Expense.group_id == group_id)
    expenses = query.order_by(Expense.date.desc(), Expense.created_at.desc()).offset(skip).limit(limit).all()
    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: str, db: Session = Depends(get_db)):
    """Retrieve details for a specific expense."""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with ID '{expense_id}' not found.",
        )
    return expense
