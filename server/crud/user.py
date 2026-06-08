from sqlalchemy.orm import Session
import uuid
from server.models.user import User, UserPreference
from server.schemas.user import UserCreate, UserPreferenceUpdate

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate):
    db_user = User(email=user.email, username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_preferences(db: Session, user_id: uuid.UUID):
    return db.query(UserPreference).filter(UserPreference.user_id == user_id).first()

def update_user_preferences(db: Session, user_id: uuid.UUID, preferences: UserPreferenceUpdate):
    db_preferences = get_user_preferences(db, user_id)
    if db_preferences:
        update_data = preferences.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_preferences, key, value)
        db.commit()
        db.refresh(db_preferences)
    return db_preferences
