from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from typing import Optional
from datetime import datetime, timedelta
from server.database import get_db
from server.models import User, Visitor
from server.schemas import UserLogin, Token

router = APIRouter()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_role(payload: dict = Depends(get_current_user_payload)):
    role = payload.get("role")
    if not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Role not found in token"
        )
    return role


@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    # Check if it's a staff/security user
    user = db.query(User).filter(User.username == login_data.username_or_email).first()
    if user and user.password_hash == login_data.password:
        access_token = create_access_token(
            data={"sub": str(user.id), "role": user.role}
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
        }

    # Check if it's a visitor
    visitor = (
        db.query(Visitor).filter(Visitor.email == login_data.username_or_email).first()
    )
    if visitor and visitor.password_hash == login_data.password:
        access_token = create_access_token(
            data={"sub": str(visitor.id), "role": "visitor"}
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "visitor",
            "user_id": visitor.id,
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
    )
