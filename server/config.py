import os


class Settings:
    PROJECT_NAME: str = "Lost and Found Management System"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    TESTING: bool = os.getenv("TESTING", "false").lower() == "true"


settings = Settings()
