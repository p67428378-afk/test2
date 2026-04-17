import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/kyc_db")
    UIDAI_API_URL: str = "https://your-uidai-api-url.com"
    NSDL_API_URL: str = "https://your-nsdl-api-url.com"
    RBI_SANCTIONS_API_URL: str = "https://your-rbi-sanctions-api-url.com"

    class Config:
        env_file = ".env"

settings = Settings()
