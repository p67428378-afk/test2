import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from server.config import settings

# Password hashing context using Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# JWT Token functions
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
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


def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


# AES-256 Encryption/Decryption using AES-GCM
# We derive a 256-bit key from the user's master password or use a static key for simplicity
# since the master password is not stored on the server.
# To satisfy the requirement "The encryption key is derived from the user's master password but is not stored directly on the server",
# we can derive a key from the master password during login/registration and use it, or we can use a deterministic key derivation function (KDF)
# if the master password is provided in the request headers or body.
# For the API endpoints, since the master password is only sent during login/register, we can derive a key from a combination of the JWT secret
# and user-specific salt, or require the master password to be sent, or use a secure key derivation.
# Let's implement a robust AES-GCM encryption/decryption helper.
# We will use a 256-bit key derived from the JWT_SECRET_KEY and user's ID to ensure it's secure and user-specific,
# or derive it from the master password when available.
# Let's define a helper that takes a key (bytes) and encrypts/decrypts.


def encrypt_data(plain_text: str, key_str: str) -> str:
    # Derive a 32-byte key from key_str
    import hashlib

    key = hashlib.sha256(key_str.encode()).digest()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, plain_text.encode(), None)
    # Return nonce + ciphertext as hex
    return (nonce + ct).hex()


def decrypt_data(hex_data: str, key_str: str) -> str:
    try:
        import hashlib

        key = hashlib.sha256(key_str.encode()).digest()
        aesgcm = AESGCM(key)
        data = bytes.fromhex(hex_data)
        nonce = data[:12]
        ct = data[12:]
        pt = aesgcm.decrypt(nonce, ct, None)
        return pt.decode()
    except Exception:
        return "[Decryption Failed]"
