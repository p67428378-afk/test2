from sqlalchemy.orm import Session
from server import models
from typing import Optional
from uuid import UUID


def get_user_by_id(db: Session, user_id: UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_user(db: Session, user_data: dict):
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# New Leave Management CRUD Functions
def create_leave_request(
    db: Session,
    employee_id: UUID,
    manager_id: UUID,
    leave_type: str,
    start_date,
    end_date,
    reason: str,
):
    db_request = models.LeaveRequest(
        employee_id=employee_id,
        manager_id=manager_id,
        leave_type=leave_type,
        start_date=start_date,
        end_date=end_date,
        reason=reason,
        status="Pending",
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_leave_request_by_id(db: Session, request_id: UUID):
    return (
        db.query(models.LeaveRequest)
        .filter(models.LeaveRequest.id == request_id)
        .first()
    )


def get_leave_requests_by_employee(db: Session, employee_id: UUID):
    return (
        db.query(models.LeaveRequest)
        .filter(models.LeaveRequest.employee_id == employee_id)
        .order_by(models.LeaveRequest.created_at.desc())
        .all()
    )


def get_leave_requests_by_manager(db: Session, manager_id: UUID):
    return (
        db.query(models.LeaveRequest)
        .filter(models.LeaveRequest.manager_id == manager_id)
        .order_by(models.LeaveRequest.created_at.desc())
        .all()
    )


def update_leave_request_status(
    db: Session,
    request: models.LeaveRequest,
    status: str,
    comment: Optional[str] = None,
):
    request.status = status
    if comment is not None:
        request.manager_comment = comment
    db.commit()
    db.refresh(request)
    return request


def update_user_leave_balance(db: Session, user: models.User, new_balance: int):
    user.leave_balance = new_balance
    db.commit()
    db.refresh(user)
    return user
