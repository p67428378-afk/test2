import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/hospital.db")
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", "dev-secret-hospital-jwt-key-2026"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
