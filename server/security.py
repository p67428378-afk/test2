import os
import base64
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from server.config import settings

# We will use cryptography's PBKDF2HMAC or Scrypt to derive the key,
# or a simple SHA256 hash of master_password + salt to avoid argon2 compilation issues.
# Let's use PBKDF2HMAC from cryptography which is extremely secure and already compiled!
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

# For password hashing, we can use cryptography's PBKDF2 or a simple SHA256 with salt.
# Let's use PBKDF2HMAC to hash the master password as well, or a secure SHA256 hash.


def hash_password(password: str) -> str:
    # Generate a random salt
    salt = os.urandom(16)
    # Hash using PBKDF2HMAC
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = kdf.derive(password.encode("utf-8"))
    # Store salt and key together
    return base64.b64encode(salt + key).decode("utf-8")


def verify_password(hashed_password: str, password: str) -> bool:
    try:
        decoded = base64.b64decode(hashed_password.encode("utf-8"))
        salt = decoded[:16]
        stored_key = decoded[16:]
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = kdf.derive(password.encode("utf-8"))
        return key == stored_key
    except Exception:
        return False


def generate_salt() -> str:
    return base64.b64encode(os.urandom(16)).decode("utf-8")


def derive_dek(master_password: str, salt: str) -> bytes:
    salt_bytes = base64.b64decode(salt.encode("utf-8"))
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt_bytes,
        iterations=100000,
    )
    return kdf.derive(master_password.encode("utf-8"))


def encrypt_data(data: str, dek: bytes) -> tuple[bytes, bytes]:
    iv = os.urandom(12)
    aesgcm = AESGCM(dek)
    encrypted = aesgcm.encrypt(iv, data.encode("utf-8"), None)
    return encrypted, iv


def decrypt_data(encrypted_data: bytes, iv: bytes, dek: bytes) -> str:
    aesgcm = AESGCM(dek)
    decrypted = aesgcm.decrypt(iv, encrypted_data, None)
    return decrypted.decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt
