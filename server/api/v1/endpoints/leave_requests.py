from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user
from datetime import date
from uuid import UUID
from typing import Optional
import logging

router = APIRouter()
logger = logging.getLogger("leave_management")


def send_email_notification(to_email: str, subject: str, body: str):
    # Simulate sending an email by logging it
    logger.info(f"Sending email to {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body: {body}")
    print(f"--- EMAIL SENT TO {to_email} ---")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    print("--------------------------------")


@router.post("/leave-requests", response_model=schemas.LeaveRequestResponse)
def apply_leave(
    request: schemas.LeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if request.end_date < request.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be before start date",
        )

    if request.start_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit requests for past dates",
        )

    requested_days = (request.end_date - request.start_date).days + 1
    if current_user.leave_balance < requested_days:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient leave balance"
        )

    manager_id = current_user.manager_id
    if not manager_id:
        # Fallback: find the first manager in the database
        manager = db.query(models.User).filter(models.User.role == "manager").first()
        if manager:
            manager_id = manager.id
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No manager assigned to this user",
            )

    db_request = crud.create_leave_request(
        db=db,
        employee_id=current_user.id,
        manager_id=manager_id,
        leave_type=request.leave_type,
        start_date=request.start_date,
        end_date=request.end_date,
        reason=request.reason,
    )

    # Send notification to manager
    manager_user = crud.get_user_by_id(db, manager_id)
    if manager_user:
        send_email_notification(
            to_email=manager_user.email,
            subject="New Leave Request Submitted",
            body=f"Hello {manager_user.name},\n\n{current_user.name} has submitted a new leave request for {request.leave_type} from {request.start_date} to {request.end_date}.\n\nReason: {request.reason}\n\nPlease log in to approve or reject this request.",
        )

    return db_request


@router.get("/leave-requests/me", response_model=list[schemas.LeaveRequestResponse])
def get_my_leave_requests(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return crud.get_leave_requests_by_employee(db, current_user.id)


@router.get(
    "/leave-requests/team", response_model=list[schemas.TeamLeaveRequestResponse]
)
def get_team_leave_requests(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="User is not a manager"
        )

    requests = crud.get_leave_requests_by_manager(db, current_user.id)
    if status_filter:
        requests = [r for r in requests if r.status.lower() == status_filter.lower()]

    result = []
    for r in requests:
        emp = crud.get_user_by_id(db, r.employee_id)
        emp_name = emp.name if emp else "Unknown"
        result.append(
            {
                "id": r.id,
                "employee_id": r.employee_id,
                "manager_id": r.manager_id,
                "leave_type": r.leave_type,
                "start_date": r.start_date,
                "end_date": r.end_date,
                "reason": r.reason,
                "status": r.status,
                "manager_comment": r.manager_comment,
                "created_at": r.created_at,
                "updated_at": r.updated_at,
                "employee_name": emp_name,
            }
        )
    return result


@router.put(
    "/leave-requests/{request_id}/status", response_model=schemas.LeaveRequestResponse
)
def update_request_status(
    request_id: UUID,
    payload: schemas.LeaveRequestStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_request = crud.get_leave_request_by_id(db, request_id)
    if not db_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Leave request not found"
        )

    if db_request.manager_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not the assigned manager for this request",
        )

    if db_request.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status transition"
        )

    if payload.status not in ["Approved", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status transition"
        )

    updated_request = crud.update_leave_request_status(
        db=db, request=db_request, status=payload.status, comment=payload.comment
    )

    # If approved, deduct leave balance
    if payload.status == "Approved":
        employee = crud.get_user_by_id(db, db_request.employee_id)
        if employee:
            requested_days = (db_request.end_date - db_request.start_date).days + 1
            new_balance = employee.leave_balance - requested_days
            crud.update_user_leave_balance(db, employee, new_balance)

    # Send notification to employee
    employee = crud.get_user_by_id(db, db_request.employee_id)
    if employee:
        send_email_notification(
            to_email=employee.email,
            subject=f"Leave Request {payload.status}",
            body=f"Hello {employee.name},\n\nYour leave request for {db_request.leave_type} from {db_request.start_date} to {db_request.end_date} has been {payload.status} by your manager.\n\nComment: {payload.comment or 'None'}",
        )

    return updated_request
