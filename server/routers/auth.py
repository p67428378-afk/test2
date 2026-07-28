from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db, log_audit
from server.models import User, Role
from server.schemas import (
    UserRegister,
    UserRegisterResponse,
    UserLogin,
    UserLoginResponse,
)
from server.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )

    # Check if role exists
    role = db.query(Role).filter(Role.name == user_in.role_name).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role '{user_in.role_name}' does not exist",
        )

    # Create user
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username, password_hash=hashed_password, role_id=role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log audit
    log_audit(
        db,
        new_user.id,
        "USER_REGISTER",
        {"username": new_user.username, "role": role.name},
    )

    return new_user


@router.post("/login", response_model=UserLoginResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    role = db.query(Role).filter(Role.id == user.role_id).first()
    role_name = role.name if role else "Unknown"

    access_token = create_access_token(data={"sub": user.username})

    # Log audit
    log_audit(db, user.id, "USER_LOGIN", {"username": user.username})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "role": role_name},
    }
