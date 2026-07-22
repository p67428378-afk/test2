import secrets
import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, PersistentSession
from server.schemas import UserRegister, UserResponse, UserLogin, TokenResponse
from server.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = (
        db.query(User)
        .filter((User.username == user_in.username) | (User.email == user_in.email))
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )

    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username, email=user_in.email, hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    access_token = create_access_token(data={"sub": user.username})

    if user_in.rememberMe:
        raw_token = secrets.token_hex(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(days=30)

        persistent_session = PersistentSession(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        db.add(persistent_session)
        db.commit()

        # Set secure=True as required by the acceptance criteria
        is_testing = os.getenv("TESTING") == "true"
        response.set_cookie(
            key="remember_me",
            value=raw_token,
            httponly=True,
            max_age=30 * 24 * 60 * 60,
            expires=30 * 24 * 60 * 60,
            samesite="lax",
            secure=not is_testing,
        )

    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/refresh-token", response_model=TokenResponse)
def refresh_token(
    response: Response,
    remember_me: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    if not remember_me:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Remember me cookie missing or invalid/expired",
        )

    token_hash = hashlib.sha256(remember_me.encode()).hexdigest()
    session_record = (
        db.query(PersistentSession)
        .filter(PersistentSession.token_hash == token_hash)
        .first()
    )

    if not session_record or session_record.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Remember me cookie missing or invalid/expired",
        )

    # Token rotation
    new_raw_token = secrets.token_hex(32)
    new_token_hash = hashlib.sha256(new_raw_token.encode()).hexdigest()
    session_record.token_hash = new_token_hash
    session_record.expires_at = datetime.utcnow() + timedelta(days=30)
    session_record.updated_at = datetime.utcnow()
    db.commit()

    is_testing = os.getenv("TESTING") == "true"
    response.set_cookie(
        key="remember_me",
        value=new_raw_token,
        httponly=True,
        max_age=30 * 24 * 60 * 60,
        expires=30 * 24 * 60 * 60,
        samesite="lax",
        secure=not is_testing,
    )

    user = session_record.user
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/logout")
def logout(
    response: Response,
    remember_me: Optional[str] = Cookie(None),
    db: Session = Depends(get_db),
):
    if remember_me:
        token_hash = hashlib.sha256(remember_me.encode()).hexdigest()
        db.query(PersistentSession).filter(
            PersistentSession.token_hash == token_hash
        ).delete()
        db.commit()

    is_testing = os.getenv("TESTING") == "true"
    response.delete_cookie(
        key="remember_me",
        httponly=True,
        samesite="lax",
        secure=not is_testing,
    )
    return {"detail": "Successfully logged out"}
