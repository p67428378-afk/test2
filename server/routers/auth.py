from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import UserRegister, UserLogin, UserResponse, Token
from server.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Validate role if provided
    valid_roles = ["Visitor", "Guide", "Administrator"]
    role = user_in.role if user_in.role in valid_roles else "Visitor"

    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        password_hash=hashed_pw,
        full_name=user_in.full_name,
        role=role,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is disabled",
        )

    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/guides", response_model=List[UserResponse])
def get_guides(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    guides = db.query(User).filter(User.role == "Guide").all()
    return guides
