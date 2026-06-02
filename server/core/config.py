
from pydantic import BaseModel
import os

class Settings(BaseModel):
    PROJECT_NAME: str = "Temple Prayer Booking System"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

settings = Settings()
