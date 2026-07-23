from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
import bcrypt
from server import schemas, crud, models
from server.database import get_db
from server.core.config import settings

router = APIRouter()


def get_current_user(
    authorization: Optional[str] = Header(None), db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/auth/login", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    try:
        is_valid = bcrypt.checkpw(
            request.password.encode("utf-8"), user.hashed_password.encode("utf-8")
        )
    except Exception:
        is_valid = False

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create access token
    access_token_expires = timedelta(minutes=60)
    to_encode = {
        "sub": user.email,
        "exp": datetime.now(timezone.utc) + access_token_expires,
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )

    return schemas.TokenResponse(access_token=encoded_jwt, token_type="bearer")


@router.get("/worklist", response_model=schemas.WorklistResponse)
def get_worklist(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    since: Optional[datetime] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = crud.get_worklist_items(
        db, user_id=current_user.id, skip=skip, limit=limit, since=since
    )
    total = crud.get_worklist_total(db, user_id=current_user.id, since=since)
    return schemas.WorklistResponse(items=items, total=total)


@router.post("/worklist", response_model=schemas.WorklistItemResponse)
def create_worklist_item(
    request: schemas.WorklistItemCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = crud.create_worklist_item(db, user_id=current_user.id, item=request)
    return item
