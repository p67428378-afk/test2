from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from server.database import get_db, get_password_hash, verify_password
from server.models import User
from server.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse,
)
from server.auth import create_access_token, get_current_user
from server.audit import log_audit_event

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(
    user_in: UserRegisterRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        log_audit_event(
            db=db,
            action="USER_REGISTER_FAILED",
            resource="/api/v1/auth/register",
            status_code=400,
            ip_address=client_ip,
            details={"email": user_in.email, "reason": "Email already registered"},
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_audit_event(
        db=db,
        user_id=user.id,
        user_email=user.email,
        action="USER_REGISTER",
        resource=f"/users/{user.id}",
        status_code=201,
        ip_address=client_ip,
        details={"email": user.email, "role": user.role},
    )
    return user


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: UserLoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        log_audit_event(
            db=db,
            action="LOGIN_FAILED",
            resource="/api/v1/auth/login",
            status_code=401,
            ip_address=client_ip,
            details={"email": login_data.email, "reason": "Invalid credentials"},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        log_audit_event(
            db=db,
            user_id=user.id,
            user_email=user.email,
            action="LOGIN_BLOCKED",
            resource="/api/v1/auth/login",
            status_code=403,
            ip_address=client_ip,
            details={"reason": "Inactive user account"},
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )

    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )
    log_audit_event(
        db=db,
        user_id=user.id,
        user_email=user.email,
        action="LOGIN_SUCCESS",
        resource="/api/v1/auth/login",
        status_code=200,
        ip_address=client_ip,
        details={"role": user.role},
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="LOGOUT",
        resource="/api/v1/auth/logout",
        status_code=200,
        ip_address=client_ip,
    )
    return {"message": "Logged out successfully"}
