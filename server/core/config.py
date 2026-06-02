
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    TESTING: bool = False

settings = Settings()
