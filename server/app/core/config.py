from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vehicle Insurance Premium Calculator"
    API_V1_STR: str = "/api/v1"
    # The database URI for the main application.
    # This can be a PostgreSQL URI in production.
    # For development, a SQLite URI is used.
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./test.db"

    class Config:
        case_sensitive = True

settings = Settings()
