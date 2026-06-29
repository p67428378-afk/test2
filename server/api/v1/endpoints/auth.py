"""
Module: auth
Purpose: Authentication endpoints for user registration, login, and profile retrieval.
"""

import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    login_id = payload.get("sub")
    if not login_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user_by_login_id(db, login_id=login_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.post(
    "/register",
    response_model=schemas.UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: schemas.UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if username or mobile number already registered
    existing_user_by_login = crud.get_user_by_login_id(db, login_id=request.login_id)
    if existing_user_by_login:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or mobile number already registered",
        )
    existing_user_by_mobile = crud.get_user_by_mobile_number(
        db, mobile_number=request.mobile_number
    )
    if existing_user_by_mobile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or mobile number already registered",
        )

    db_user = crud.create_user(db, request)
    return db_user


@router.post("/login", response_model=schemas.UserLoginResponse)
def login(request: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_login_id(db, login_id=request.login_id)
    if not user or crud.hash_password(request.password) != user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.login_id})
    return schemas.UserLoginResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=schemas.UserMeResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
