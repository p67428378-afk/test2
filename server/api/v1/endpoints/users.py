from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import SessionLocal
from server.api.v1.endpoints.auth import oauth2_scheme, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(user: schemas.User, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.email = user.email
    current_user.preferences = user.preferences
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/watch-history", response_model=list[schemas.WatchHistory])
def get_watch_history(skip: int = 0, limit: int = 100, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_watch_history(db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("/me/watch-history", response_model=schemas.WatchHistory)
def create_watch_history(watch_history: schemas.WatchHistoryCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_watch_history(db=db, watch_history=watch_history, user_id=current_user.id)

@router.put("/me/watch-history/{watch_id}", response_model=schemas.WatchHistory)
def update_watch_history(watch_id: int, rating: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.update_watch_history(db=db, watch_id=watch_id, rating=rating)

@router.delete("/me/watch-history/{watch_id}")
def delete_watch_history(watch_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    crud.delete_watch_history(db=db, watch_id=watch_id)
    return {"ok": True}

@router.get("/me/recommendations", response_model=list[schemas.Movie])
def get_recommendations(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # This is a placeholder. A real implementation would use a recommendation engine.
    return crud.get_movies(db, limit=10)
