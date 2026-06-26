"""
Module: config
Purpose: Application configuration settings using Pydantic Settings.
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str  # Security-sensitive, no default to comply with Constitution
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"


# For testing and local development, we can load from environment or set a fallback if not in production
if not os.getenv("SECRET_KEY"):
    os.environ["SECRET_KEY"] = "super-secret-key-for-local-dev-only-1234567890"

settings = Settings()
