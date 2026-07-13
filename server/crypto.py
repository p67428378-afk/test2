import hashlib
import bcrypt


# We implement bcrypt hashing directly using the bcrypt library to avoid passlib's 72-character limit bug.
def hash_master_password(password: str) -> str:
    # Pre-hash with SHA-256 to handle any password length safely
    pw_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw_hash.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_master_password(plain_password: str, hashed_password: str) -> bool:
    pw_hash = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return bcrypt.checkpw(pw_hash.encode("utf-8"), hashed_password.encode("utf-8"))
