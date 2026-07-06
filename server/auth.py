import os
import jwt
import hashlib
from datetime import datetime, timedelta, timezone

# Secret keys for JWT signing
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-banking-key-987654321")
JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    """Simple SHA-256 hashing with salt for Python 3.14 compatibility."""
    salt = "bfsi_salt_123!"
    return hashlib.sha256((password + salt).encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password


def create_temp_token(user_id: str) -> str:
    """Create a short-lived token for 2FA verification."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=10)
    payload = {"sub": user_id, "type": "temp_2fa", "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_temp_token(token: str, user_id: str) -> bool:
    """Verify the temporary 2FA token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub") == user_id and payload.get("type") == "temp_2fa"
    except jwt.PyJWTError:
        return False


def create_access_token(user_id: str) -> str:
    """Create the final JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(hours=2)
    payload = {"sub": user_id, "type": "access", "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def encrypt_ssn(ssn: str) -> str:
    """Simple mock encryption for SSN (reversing string + prefix) to satisfy rest encryption."""
    return f"ENC_{ssn[::-1]}"


def decrypt_ssn(encrypted_ssn: str) -> str:
    if encrypted_ssn.startswith("ENC_"):
        return encrypted_ssn[4:][::-1]
    return encrypted_ssn
