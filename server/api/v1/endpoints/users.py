from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from server import crud, models, schemas
from server.api.v1.endpoints.auth import ALGORITHM, SECRET_KEY
from server.database import get_db

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
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
def update_user_me(
    user_update: schemas.User,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # This is a simplified update. In a real application, you would handle this more robustly.
    current_user.email = user_update.email
    current_user.preferences = user_update.preferences
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/watch-history", response_model=list[schemas.WatchHistory])
def get_my_watch_history(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return crud.get_watch_history(db, user_id=current_user.id)


@router.post("/me/watch-history", response_model=schemas.WatchHistory)
def add_to_my_watch_history(
    watch_history_entry: schemas.WatchHistoryCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud.add_to_watch_history(
        db, user_id=current_user.id, watch_history_entry=watch_history_entry
    )


@router.put("/me/watch-history/{watch_id}", response_model=schemas.WatchHistory)
def update_my_watch_history(
    watch_id: UUID,
    watch_history_update: schemas.WatchHistoryUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Ensure the user owns this watch history entry
    history_entry = crud.get_watch_history_entry(db, watch_id)
    if not history_entry or history_entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Watch history entry not found")
    return crud.update_watch_history(
        db, watch_id=watch_id, rating=watch_history_update.rating
    )


@router.delete("/me/watch-history/{watch_id}")
def remove_from_my_watch_history(
    watch_id: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Ensure the user owns this watch history entry
    history_entry = crud.get_watch_history_entry(db, watch_id)
    if not history_entry or history_entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Watch history entry not found")
    crud.remove_from_watch_history(db, watch_id=watch_id)
    return {"ok": True}


@router.get("/me/recommendations", response_model=list[schemas.Movie])
def get_my_recommendations(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # This is a placeholder for a real recommendation engine.
    # For now, it returns the most recently watched movies.
    watch_history = crud.get_watch_history(db, user_id=current_user.id)
    movie_ids = [entry.movie_id for entry in watch_history]
    # A real implementation would have a more sophisticated algorithm
    return db.query(models.Movie).filter(models.Movie.id.in_(movie_ids)).limit(10).all()
