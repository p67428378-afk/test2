import uuid
from typing import Optional
from sqlalchemy.orm import Session
from server import models, schemas


def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


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


def get_tasks(db: Session, status: Optional[str] = None, sort: str = "desc"):
    query = db.query(models.Task)
    if status:
        query = query.filter(models.Task.status == status)
    if sort == "asc":
        query = query.order_by(models.Task.created_at.asc())
    else:
        query = query.order_by(models.Task.created_at.desc())
    return query.all()


def get_task(db: Session, task_id: uuid.UUID):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(title=task.title, status="To Do", assignee=task.assignee)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task_status(
    db: Session, db_task: models.Task, status: str, assignee: Optional[str] = None
):
    db_task.status = status
    if assignee is not None:
        db_task.assignee = assignee
    db.commit()
    db.refresh(db_task)
    return db_task
