"""Auth endpoints for user registration, login, and current user profile."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.auth import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from server.crud import create_user, get_user_by_email
from server.database import get_db
from server.models import User
from server.schemas import Token, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists.",
        )
    hashed_password = get_password_hash(user_in.password)
    user = create_user(db, user_in, hashed_password)
    return user


@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, login_in.email)
    if not user or not verify_password(login_in.password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user": user,
    }


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
