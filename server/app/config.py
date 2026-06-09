import os
from pydantic_settings import BaseSettings

class Settings(pydantic_settings := BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    TESTING: bool = os.getenv("TESTING", "false").lower() == "true"

    class Config:
        env_file = ".env"

settings = Settings()
