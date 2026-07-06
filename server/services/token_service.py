import jwt
from datetime import datetime, timedelta
from uuid import UUID
from server.core.config import settings

# In-memory mock Redis set to track used JTIs (since we use SQLite in-memory for tests and don't require a real Redis server running)
_used_jtis = set()


class TokenService:
    @staticmethod
    def generate_token(
        transaction_id: UUID, jti: str, expires_in_minutes: int = 10
    ) -> str:
        payload = {
            "sub": str(transaction_id),
            "jti": jti,
            "exp": datetime.utcnow() + timedelta(minutes=expires_in_minutes),
        }
        return jwt.encode(
            payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def verify_token(token: str) -> dict:
        """
        Verifies the JWT token.
        Returns the payload if valid, raises jwt.PyJWTError or ValueError if invalid/expired/replayed.
        """
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        jti = payload.get("jti")
        if not jti:
            raise ValueError("Token missing JTI")

        if jti in _used_jtis:
            raise ValueError("Token has already been used")

        return payload

    @staticmethod
    def invalidate_token(jti: str) -> None:
        _used_jtis.add(jti)
