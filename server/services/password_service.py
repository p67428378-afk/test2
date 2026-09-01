import math
import secrets
import string
from datetime import datetime, timezone
from server.schemas.passwords import PasswordGenerateRequest, PasswordGenerateResponse

# Special symbols matching acceptance criteria: !@#$%^&*()_+-=[]{}|;:,.<>?
SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
UPPERCASE = string.ascii_uppercase
LOWERCASE = string.ascii_lowercase
DIGITS = string.digits


class PasswordService:
    @staticmethod
    def calculate_entropy(length: int, pool_size: int) -> float:
        if pool_size <= 0 or length <= 0:
            return 0.0
        entropy = length * math.log2(pool_size)
        return round(entropy, 1)

    @staticmethod
    def calculate_strength(entropy_bits: float) -> str:
        if entropy_bits < 35:
            return "Very Weak"
        elif entropy_bits < 55:
            return "Weak"
        elif entropy_bits < 75:
            return "Medium"
        elif entropy_bits < 95:
            return "Strong"
        else:
            return "Very Strong"

    @classmethod
    def generate_password(
        cls, request: PasswordGenerateRequest
    ) -> PasswordGenerateResponse:
        pools = []
        if request.include_uppercase:
            pools.append(UPPERCASE)
        if request.include_lowercase:
            pools.append(LOWERCASE)
        if request.include_digits:
            pools.append(DIGITS)
        if request.include_symbols:
            pools.append(SYMBOLS)

        if not pools:
            raise ValueError(
                "At least one character set (uppercase, lowercase, digits, or symbols) must be selected."
            )

        combined_pool = "".join(pools)
        pool_size = len(combined_pool)

        # Guarantee at least one character from each selected set if length >= len(pools)
        password_chars = []
        if request.length >= len(pools):
            for pool in pools:
                password_chars.append(secrets.choice(pool))

        remaining_length = request.length - len(password_chars)
        for _ in range(remaining_length):
            password_chars.append(secrets.choice(combined_pool))

        # Securely shuffle using CSPRNG
        sr = secrets.SystemRandom()
        sr.shuffle(password_chars)

        password = "".join(password_chars)
        entropy_bits = cls.calculate_entropy(request.length, pool_size)
        strength = cls.calculate_strength(entropy_bits)
        generated_at = datetime.now(timezone.utc).isoformat()

        return PasswordGenerateResponse(
            password=password,
            length=request.length,
            entropy_bits=entropy_bits,
            strength=strength,
            generated_at=generated_at,
        )
