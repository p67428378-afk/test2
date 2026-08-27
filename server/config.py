import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Donation Management Portal"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/donation_portal.db")
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", "dev-secret-key-change-in-production-12345"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
    )

    class Config:
        case_sensitive = True


settings = Settings()
