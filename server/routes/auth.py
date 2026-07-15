from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User
from server.schemas import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    UserLoginResponse,
)
from server.security import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post(
    "/register",
    response_model=UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Hash master password
    hashed_pw = hash_password(request.master_password)

    # Create user
    new_user = User(email=request.email, master_password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=UserLoginResponse)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(
        request.master_password, user.master_password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or master password",
        )

    # Create access token containing user_id and email
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
