
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    CORE_BANKING_API_URL: str = "https://api.corebanking.example.com"
    CORE_BANKING_API_KEY: str = "your_api_key"
    CLOUD_STORAGE_BUCKET: str = "your-gcs-bucket-name"
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
