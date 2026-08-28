import uuid
from datetime import date, datetime, timedelta, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.models.leave_balance import LeaveBalance
from server.models.leave_request import LeaveRequest
from server.models.user import User
from server.schemas.leave_request import LeaveRequestCreate, LeaveStatusUpdate


DEFAULT_ALLOCATIONS = [
    {"leave_type": "VACATION", "allocated": 15, "used": 0, "remaining": 15},
    {"leave_type": "SICK", "allocated": 10, "used": 0, "remaining": 10},
    {"leave_type": "PERSONAL", "allocated": 5, "used": 0, "remaining": 5},
    {"leave_type": "UNPAID", "allocated": 0, "used": 0, "remaining": 0},
]


def calculate_business_days(start_date: date, end_date: date) -> int:
    """Calculate inclusive business days (Monday to Friday)."""
    if start_date > end_date:
        return 0
    cur = start_date
    count = 0
    while cur <= end_date:
        if cur.weekday() < 5:  # 0=Monday, ..., 4=Friday
            count += 1
        cur += timedelta(days=1)
    return count


def get_or_create_user_balances(
    db: Session, user_id: str, year: int
) -> List[LeaveBalance]:
    """Retrieve all leave balances for a user and year, initializing defaults if missing."""
    existing = (
        db.query(LeaveBalance)
        .filter(LeaveBalance.user_id == user_id, LeaveBalance.year == year)
        .all()
    )
    existing_types = {b.leave_type: b for b in existing}

    created = False
    for alloc in DEFAULT_ALLOCATIONS:
        lt = alloc["leave_type"]
        if lt not in existing_types:
            bal = LeaveBalance(
                id=str(uuid.uuid4()),
                user_id=user_id,
                year=year,
                leave_type=lt,
                allocated_days=alloc["allocated"],
                used_days=alloc["used"],
                remaining_days=alloc["remaining"],
            )
            db.add(bal)
            created = True

    if created:
        db.commit()
        existing = (
            db.query(LeaveBalance)
            .filter(LeaveBalance.user_id == user_id, LeaveBalance.year == year)
            .all()
        )

    # Return in standard order
    order_map = {"VACATION": 1, "SICK": 2, "PERSONAL": 3, "UNPAID": 4}
    return sorted(existing, key=lambda x: order_map.get(x.leave_type, 99))


def check_overlapping_requests(
    db: Session,
    user_id: str,
    start_date: date,
    end_date: date,
    exclude_id: Optional[str] = None,
) -> bool:
    """Check if any active request (PENDING or APPROVED) overlaps with the given range."""
    query = db.query(LeaveRequest).filter(
        LeaveRequest.user_id == user_id,
        LeaveRequest.status.in_(["PENDING", "APPROVED"]),
        LeaveRequest.start_date <= end_date,
        LeaveRequest.end_date >= start_date,
    )
    if exclude_id:
        query = query.filter(LeaveRequest.id != exclude_id)
    return query.first() is not None


def create_leave_request(db: Session, data: LeaveRequestCreate) -> LeaveRequest:
    # 1. Verify user exists
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID '{data.user_id}' not found.",
        )

    # 2. Calculate business days
    total_days = calculate_business_days(data.start_date, data.end_date)
    if total_days <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested leave duration contains 0 business days.",
        )

    # 3. Check for overlapping requests
    if check_overlapping_requests(db, data.user_id, data.start_date, data.end_date):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Overlapping leave request exists for the specified dates.",
        )

    # 4. Check available balance
    year = data.start_date.year
    balances = get_or_create_user_balances(db, data.user_id, year)
    bal_dict = {b.leave_type: b for b in balances}

    if data.leave_type != "UNPAID":
        bal = bal_dict.get(data.leave_type)
        if not bal or bal.remaining_days < total_days:
            rem = bal.remaining_days if bal else 0
            leave_name = data.leave_type.capitalize()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Requested leave duration ({total_days} days) exceeds remaining {leave_name} balance ({rem} days).",
            )

    # 5. Create leave request
    leave_req = LeaveRequest(
        id=str(uuid.uuid4()),
        user_id=data.user_id,
        leave_type=data.leave_type,
        start_date=data.start_date,
        end_date=data.end_date,
        total_days=total_days,
        reason=data.reason,
        status="PENDING",
        manager_comment=None,
    )
    db.add(leave_req)
    db.commit()
    db.refresh(leave_req)
    return leave_req


def update_leave_status(
    db: Session,
    leave_id: str,
    update_data: LeaveStatusUpdate,
) -> LeaveRequest:
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Leave request with ID '{leave_id}' not found.",
        )

    if leave.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update status of a finalized leave request.",
        )

    if update_data.status == "REJECTED":
        if not update_data.manager_comment or not update_data.manager_comment.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Manager comment is required when rejecting a leave request.",
            )
        leave.status = "REJECTED"
        leave.manager_comment = update_data.manager_comment.strip()
    elif update_data.status == "APPROVED":
        # Deduct balance
        year = leave.start_date.year
        balances = get_or_create_user_balances(db, leave.user_id, year)
        bal_dict = {b.leave_type: b for b in balances}
        bal = bal_dict.get(leave.leave_type)

        if leave.leave_type != "UNPAID":
            if not bal or bal.remaining_days < leave.total_days:
                rem = bal.remaining_days if bal else 0
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot approve: remaining balance ({rem} days) is less than requested duration ({leave.total_days} days).",
                )
            bal.used_days += leave.total_days
            bal.remaining_days = max(0, bal.allocated_days - bal.used_days)
        else:
            if bal:
                bal.used_days += leave.total_days

        leave.status = "APPROVED"
        leave.manager_comment = (
            update_data.manager_comment.strip() if update_data.manager_comment else None
        )

    leave.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(leave)
    return leave
