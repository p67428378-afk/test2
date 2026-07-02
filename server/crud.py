from sqlalchemy.orm import Session
from server import models, schemas
import uuid


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


# Todo CRUD operations
def get_todos(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Todo).offset(skip).limit(limit).all()


def get_todo(db: Session, todo_id: uuid.UUID):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


def create_todo(db: Session, todo: schemas.TodoCreate):
    db_todo = models.Todo(text=todo.text)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_todo(db: Session, db_todo: models.Todo, todo_update: schemas.TodoUpdate):
    if todo_update.text is not None:
        db_todo.text = todo_update.text
    if todo_update.is_completed is not None:
        db_todo.is_completed = todo_update.is_completed
    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, db_todo: models.Todo):
    db.delete(db_todo)
    db.commit()
