from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import Optional
from server import models, schemas
from server.database import get_password_hash
from uuid import UUID


# Existing CRUD functions for password reset microservice
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


# New CRUD functions for User Auth
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: schemas.UserRegisterRequest):
    db_user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "user",
        login_id=user_in.email.split("@")[0],
        mobile_number=None,
        security_question="What is your role?",
        security_answer_hash=get_password_hash(user_in.role or "user"),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# New CRUD functions for Worklist Items
def get_worklist_item(db: Session, item_id: UUID):
    return (
        db.query(models.WorklistItem).filter(models.WorklistItem.id == item_id).first()
    )


def get_worklist_items(
    db: Session,
    user_id: Optional[UUID] = None,
    status: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(models.WorklistItem)

    if user_id is not None:
        query = query.filter(models.WorklistItem.user_id == user_id)

    if status is not None:
        query = query.filter(models.WorklistItem.status == status)

    # Sorting
    sort_col = getattr(models.WorklistItem, sort_by, models.WorklistItem.created_at)
    if order == "desc":
        query = query.order_by(desc(sort_col))
    else:
        query = query.order_by(asc(sort_col))

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def create_worklist_item(
    db: Session, item_in: schemas.WorklistItemCreate, user_id: UUID
):
    db_item = models.WorklistItem(
        user_id=user_id,
        title=item_in.title,
        description=item_in.description,
        status=item_in.status or "new",
        priority=item_in.priority or 0,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_worklist_item(
    db: Session, db_item: models.WorklistItem, item_in: schemas.WorklistItemUpdate
):
    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_worklist_item(db: Session, db_item: models.WorklistItem):
    db.delete(db_item)
    db.commit()
