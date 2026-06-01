
import random
import string
from passlib.context import CryptContext
from datetime import datetime, timedelta
from server.app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_otp(length: int = settings.OTP_LENGTH) -> str:
    return "".join(random.choices(string.digits, k=length))

def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
    return pwd_context.verify(plain_otp, hashed_otp)

def get_otp_hash(otp: str) -> str:
    return pwd_context.hash(otp)

def get_otp_expiry() -> datetime:
    return datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
