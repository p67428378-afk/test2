from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.leave_request import LeaveRequest
from server.models.user import User
from server.schemas.leave_request import (
    LeaveRequestCreate,
    LeaveStatusUpdate,
    LeaveRequestResponse,
    LeaveRequestListResponse,
)
from server.services.leave_service import create_leave_request, update_leave_status

router = APIRouter(prefix="/leaves", tags=["Leaves"])


@router.post(
    "", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED
)
def submit_leave_request(
    data: LeaveRequestCreate,
    db: Session = Depends(get_db),
):
    return create_leave_request(db, data)


@router.get("", response_model=LeaveRequestListResponse)
def list_leave_requests(
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    manager_id: Optional[str] = Query(
        None, description="Filter by manager's direct reports"
    ),
    status: Optional[str] = Query(
        None, description="Filter by status: PENDING, APPROVED, REJECTED"
    ),
    year: Optional[int] = Query(None, description="Filter by start date year"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(LeaveRequest)

    if user_id:
        query = query.filter(LeaveRequest.user_id == user_id)

    if manager_id:
        # Find all direct reports of this manager
        subquery = select(User.id).filter(User.manager_id == manager_id)
        query = query.filter(LeaveRequest.user_id.in_(subquery))

    if status:
        query = query.filter(LeaveRequest.status == status.upper())

    if year:
        start_of_year = date(year, 1, 1)
        end_of_year = date(year, 12, 31)
        query = query.filter(
            LeaveRequest.start_date >= start_of_year,
            LeaveRequest.start_date <= end_of_year,
        )

    total = query.count()
    items = (
        query.order_by(LeaveRequest.created_at.desc()).offset(skip).limit(limit).all()
    )

    return LeaveRequestListResponse(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{id}", response_model=LeaveRequestResponse)
def get_leave_request(id: str, db: Session = Depends(get_db)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Leave request with ID '{id}' not found.",
        )
    return leave


@router.patch("/{id}/status", response_model=LeaveRequestResponse)
def update_request_status(
    id: str,
    update_data: LeaveStatusUpdate,
    db: Session = Depends(get_db),
):
    return update_leave_status(db, id, update_data)
