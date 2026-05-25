from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./test.db"
    FICO_API_URL: str = "https://api.example.com/fico"
    INCOME_API_URL: str = "https://api.example.com/income"

    class Config:
        env_file = ".env"

settings = Settings()
