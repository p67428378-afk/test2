"""
Module: server.config
Purpose: Configuration settings for the Food Delivery Platform.
"""

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    TESTING: bool = False
    SECRET_KEY: str = ""  # No hardcoded default for production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def validate_secret_key(self) -> "Settings":
        if not self.SECRET_KEY:
            if self.TESTING:
                self.SECRET_KEY = "supersecretkeyfortestingonly"
            else:
                raise ValueError("SECRET_KEY must be set in production")
        return self


settings = Settings()
