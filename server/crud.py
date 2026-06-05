from sqlalchemy.orm import Session
from server import models, schemas
from passlib.context import CryptContext

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

def get_movie(db: Session, movie_id: int):
    return db.query(models.Movie).filter(models.Movie.id == movie_id).first()

def create_movie(db: Session, movie: schemas.MovieCreate):
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def get_watch_history(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.WatchHistory).filter(models.WatchHistory.user_id == user_id).offset(skip).limit(limit).all()

def create_watch_history(db: Session, watch_history: schemas.WatchHistoryCreate, user_id: int):
    db_watch_history = models.WatchHistory(**watch_history.dict(), user_id=user_id)
    db.add(db_watch_history)
    db.commit()
    db.refresh(db_watch_history)
    return db_watch_history

def update_watch_history(db: Session, watch_id: int, rating: int):
    db_watch_history = db.query(models.WatchHistory).filter(models.WatchHistory.id == watch_id).first()
    db_watch_history.rating = rating
    db.commit()
    db.refresh(db_watch_history)
    return db_watch_history

def delete_watch_history(db: Session, watch_id: int):
    db_watch_history = db.query(models.WatchHistory).filter(models.WatchHistory.id == watch_id).first()
    db.delete(db_watch_history)
    db.commit()
