import uuid
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import Optional, List
from server import models, schemas


# Existing Password Reset CRUD
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
    otp.is_used = True  # type: ignore
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
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# Task CRUD
def get_tasks(
    db: Session, status: Optional[str] = None, sort: str = "desc"
) -> List[models.Task]:
    db.commit()
    query = db.query(models.Task)
    if status:
        query = query.filter(models.Task.status == status)

    if sort.lower() == "asc":
        query = query.order_by(asc(models.Task.created_at))
    else:
        query = query.order_by(desc(models.Task.created_at))

    return query.all()


def create_task(db: Session, task_in: schemas.TaskCreate) -> models.Task:
    db_task = models.Task(
        title=task_in.title, assignee=task_in.assignee, status="To Do"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_task(db: Session, task_id: uuid.UUID) -> Optional[models.Task]:
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def update_task_status(
    db: Session, task_id: uuid.UUID, status: str
) -> Optional[models.Task]:
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    db_task.status = status  # type: ignore
    db.commit()
    db.refresh(db_task)
    return db_task
