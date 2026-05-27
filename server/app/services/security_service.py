
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def tokenize_card_number(card_number: str) -> str:
    """A simple tokenization simulation. In a real-world scenario, use a dedicated tokenization vault."""
    return f"TOKEN_{card_number[-4:]}_{hash(card_number)}"

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
