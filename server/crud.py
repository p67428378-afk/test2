import uuid

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_movies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Movie).offset(skip).limit(limit).all()


def get_movie(db: Session, movie_id: uuid.UUID):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()


def get_watch_history(db: Session, user_id: uuid.UUID):
    return (
        db.query(models.WatchHistory)
        .filter(models.WatchHistory.user_id == user_id)
        .all()
    )


def get_watch_history_entry(db: Session, watch_id: uuid.UUID):
    return (
        db.query(models.WatchHistory).filter(models.WatchHistory.id == watch_id).first()
    )


def add_to_watch_history(
    db: Session, user_id: uuid.UUID, watch_history_entry: schemas.WatchHistoryCreate
):
    db_entry = models.WatchHistory(**watch_history_entry.dict(), user_id=user_id)
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def update_watch_history(db: Session, watch_id: uuid.UUID, rating: int):
    db_entry = (
        db.query(models.WatchHistory).filter(models.WatchHistory.id == watch_id).first()
    )
    if db_entry:
        db_entry.rating = rating
        db.commit()
        db.refresh(db_entry)
    return db_entry


def remove_from_watch_history(db: Session, watch_id: uuid.UUID):
    db_entry = (
        db.query(models.WatchHistory).filter(models.WatchHistory.id == watch_id).first()
    )
    if db_entry:
        db.delete(db_entry)
        db.commit()
    return db_entry
