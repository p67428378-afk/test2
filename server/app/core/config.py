from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Vehicle Insurance Premium Calculator"
    DATABASE_URL: str = "postgresql://user:password@localhost/db"

    class Config:
        case_sensitive = True

settings = Settings()
