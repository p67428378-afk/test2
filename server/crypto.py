import hashlib
import os


def get_password_hash(password: str, salt: str = None) -> tuple[str, str]:
    """
    Hash a password using PBKDF2-HMAC-SHA256.
    Returns (hex_hash, hex_salt).
    """
    if salt is None:
        salt_bytes = os.urandom(16)
        salt = salt_bytes.hex()
    else:
        salt_bytes = bytes.fromhex(salt)

    pwd_bytes = password.encode("utf-8")
    key = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, 100000)
    return key.hex(), salt


def verify_password(plain_password: str, hashed_password: str, salt: str) -> bool:
    """Verify a plain password against its stored hash and salt."""
    calc_hash, _ = get_password_hash(plain_password, salt)
    return calc_hash == hashed_password
