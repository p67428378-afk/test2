from fastapi import APIRouter, HTTPException, status
import random
import string
from server.schemas import PasswordGenerateRequest, PasswordGenerateResponse

router = APIRouter(prefix="/passwords", tags=["Passwords"])


@router.post("/generate", response_model=PasswordGenerateResponse)
def generate_password(req: PasswordGenerateRequest):
    if not any([req.lowercase, req.uppercase, req.numbers, req.symbols]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one character type must be selected",
        )

    chars = ""
    if req.lowercase:
        chars += string.ascii_lowercase
    if req.uppercase:
        chars += string.ascii_uppercase
    if req.numbers:
        chars += string.digits
    if req.symbols:
        chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    # Ensure we have at least one of each selected type in the password
    password_chars = []
    if req.lowercase:
        password_chars.append(random.choice(string.ascii_lowercase))
    if req.uppercase:
        password_chars.append(random.choice(string.ascii_uppercase))
    if req.numbers:
        password_chars.append(random.choice(string.digits))
    if req.symbols:
        password_chars.append(random.choice("!@#$%^&*()_+-=[]{}|;:,.<>?"))

    remaining_length = req.length - len(password_chars)
    if remaining_length > 0:
        password_chars += [random.choice(chars) for _ in range(remaining_length)]

    random.shuffle(password_chars)
    password = "".join(password_chars)

    # Simple strength rating
    if req.length < 10:
        strength = "Weak"
    elif req.length < 14:
        strength = "Medium"
    else:
        strength = "Strong"

    return {"password": password, "strength": strength}
