
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "WaterWise"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./test.db"

    class Config:
        case_sensitive = True

settings = Settings()
