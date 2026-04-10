from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/db"
    BASE_RATE: float = 500.0

    class Config:
        env_file = ".env"

settings = Settings()
