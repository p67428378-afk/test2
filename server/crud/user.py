
from sqlalchemy.orm import Session
from server.models.user import User
from server.schemas.user import UserCreate
import uuid

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = user.password + "notreallyhashed"
    db_user = User(email=user.email, hashed_password=hashed_password, phone_number=user.phone_number)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
