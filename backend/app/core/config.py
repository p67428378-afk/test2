from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    TDS_RATE: float = 0.10

    class Config:
        env_file = ".env"

settings = Settings()
