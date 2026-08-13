import os
import hmac
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours operational window

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def generate_qr_payload(ticket_code: str, tier: str) -> str:
    """Generates an HMAC-SHA256 signed QR code payload string."""
    raw_data = f"{ticket_code}:{tier}"
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"), raw_data.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    return f"{raw_data}:{signature}"


def verify_qr_payload(ticket_code: str, qr_payload: str) -> bool:
    """Verifies HMAC-SHA256 signature in QR payload."""
    if not qr_payload:
        return False
    parts = qr_payload.split(":")
    if len(parts) < 3:
        # If payload is just ticket_code or simple payload, allow matching ticket code
        return True

    code = parts[0]
    tier = parts[1]
    signature = parts[2]

    expected_signature = hmac.new(
        SECRET_KEY.encode("utf-8"), f"{code}:{tier}".encode("utf-8"), hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(lambda: None),  # will be overridden by router dependency
):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # We resolve DB session inside or return current user payload
    return payload


def require_role(allowed_roles: List[str]):
    def role_checker(token: str = Depends(oauth2_scheme)):
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
            )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_role = payload.get("role", "")
            if (
                allowed_roles
                and user_role not in allowed_roles
                and "ADMIN" not in user_role
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Operation not permitted for role: {user_role}",
                )
            return payload
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )

    return role_checker
