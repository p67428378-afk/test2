import base64
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import json
import os
from typing import Any, Union, Optional
import uuid
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from server.database import get_db

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pw_bytes = plain_password.encode("utf-8")
        hash_bytes = (
            hashed_password.encode("utf-8")
            if isinstance(hashed_password, str)
            else hashed_password
        )
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64_decode(data_str: str) -> bytes:
    padding = 4 - (len(data_str) % 4)
    if padding != 4:
        data_str += "=" * padding
    return base64.urlsafe_b64decode(data_str.encode("utf-8"))


def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"sub": str(subject), "exp": int(expire.timestamp())}

    header_b64 = _b64_encode(json.dumps(header).encode("utf-8"))
    payload_b64 = _b64_encode(json.dumps(payload).encode("utf-8"))

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256
    ).digest()
    signature_b64 = _b64_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts

        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(
            SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256
        ).digest()
        actual_sig = _b64_decode(signature_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_json = json.loads(_b64_decode(payload_b64).decode("utf-8"))
        exp = payload_json.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > exp:
            return None

        return payload_json
    except Exception:
        return None


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    from server import models

    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        return None

    user_id_str = payload.get("sub")
    if not user_id_str:
        return None

    try:
        user_uuid = uuid.UUID(str(user_id_str))
    except ValueError:
        return None

    user = db.query(models.User).filter(models.User.id == user_uuid).first()
    return user


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    from server import models

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
        )

    try:
        user_uuid = uuid.UUID(str(user_id_str))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID format in token",
        )

    user = db.query(models.User).filter(models.User.id == user_uuid).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
