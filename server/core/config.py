import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    TESTING: bool = os.getenv("TESTING", "false").lower() in ("true", "1", "t")


settings = Settings()
