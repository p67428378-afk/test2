from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BASE_PREMIUM_RATE: float = 500.0

    class Config:
        env_file = ".env"

settings = Settings()
