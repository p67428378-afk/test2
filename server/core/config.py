from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    TESTING: bool = False
    SECRET_KEY: str = "super-secret-key-for-library-management-system-123456"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    LOAN_PERIOD_DAYS: int = 14
    OVERDUE_FINE_PER_DAY: float = 0.25
    BORROWING_LIMIT: int = 5

    def __init__(self, **values):
        super().__init__(**values)
        if self.TESTING or os.getenv("TESTING") == "true":
            self.DATABASE_URL = "sqlite:///:memory:"

    class Config:
        env_file = ".env"


settings = Settings()
